<template>
    <div class="page-container mine-view">
        <div class="container img-container">
            <el-form
                style="width: 100%"
                :model="dataContainer.form"
                :inline="false"
                label-width="120px"
            >
                <el-row :gutter="0">
                    <el-col :span="24">
                        <el-form-item label="用户头像" prop="">
                            <div>
                                <div class="img-upload">
                                    <UploadSingleImg
                                        ref="UploadSingleImgRef"
                                        :imgUrl="dataContainer.imgUrl_3"
                                        :showCancelBt="!!dataContainer.imgUrl_3"
                                        :maxSize="1024 * 1024 * 7"
                                        :minSize="1024 * 7"
                                        :needAccept="'image/png,image/jpeg'"
                                        :autoUpload="false"
                                        :showChooseBt="false"
                                        :uploadApi="'/upload-api/upload'"
                                        @onSuccess="handleUploadSuccess"
                                        @onFail="handleUploadFail"
                                        @onCancel="handleUploadCancel"
                                    ></UploadSingleImg>
                                    <div @click="changeImg" class="bt">
                                        <SvgIcon
                                            :style="'width: 25px;min-width:25px;height: 25px;'"
                                            name="svg:upload.svg"
                                        ></SvgIcon>
                                    </div>
                                </div>
                                <el-button
                                    style="margin-top: 15px"
                                    type="primary"
                                    @click="handleUpload"
                                >
                                    确认修改新头像
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="container">
            <el-form
                style="width: 100%"
                :model="dataContainer.form"
                ref="FormElRef"
                :inline="false"
                :rules="dataContainer.rules"
                label-width="120px"
            >
                <el-row :gutter="0">
                    <el-col :span="24">
                        <el-form-item label="用户昵称" prop="name">
                            <el-input
                                v-model="dataContainer.form.name"
                                placeholder="请输入"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="手机号码" prop="newPassword">
                            <el-input
                                v-model="dataContainer.form.newPassword"
                                placeholder="请输入"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="邮箱" prop="newPassword_1">
                            <el-input
                                v-model="dataContainer.form.newPassword_1"
                                placeholder="请输入"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button type="primary" @click="handleSubmit"> 确定提交 </el-button>
        </div>
        <ChangeImgDialog ref="ChangeImgDialogRef"></ChangeImgDialog>
    </div>
</template>

<script>
/**
 * 密码修改页面
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
    onMounted,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import { Delete } from '@element-plus/icons-vue';
import { deepCopyObj } from '@/common/otherTools';
import { verifiedData } from '@/common/verifiedTools';
import { messageError, messageSuccess } from '@/action/messagePrompt.js';
import ChangeImgDialog from './components/changeImgDialog.vue';
import { userDataStore } from '@/store/user';

export default defineComponent({
    components: {
        SvgIcon,
        ChangeImgDialog,
    },
    setup() {
        let userData = userDataStore();
        const FormElRef = ref(null); //组件实例
        const ChangeImgDialogRef = ref(null); //组件实例
        const UploadSingleImgRef = ref(null); //组件实例
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading: false,
            form: {},
            rules: {
                name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
            },
            imgUrl_3: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        });
        const otherDataContainer = {
            imgFile: null,
        };
        /** 初始化数据 */
        function initData() {
            let userInfo = userData.userInfo;
            /** 使用一份新数据 */
            dataContainer.form = deepCopyObj(userInfo);
            dataContainer.imgUrl_3 = dataContainer.form.avatar;
        }
        initData();
        /** 提交数据 */
        function handleSubmit() {
            /** 使用组件自带方法验证数据 */
            if (!FormElRef.value) return;
            FormElRef.value.validate((valid, e) => {
                if (e) {
                    /** 打印报错信息 */
                    let msg = e[Object.keys(e)[0]][0].message;
                    messageError(msg);
                    return;
                }
                /** 其他验证 */
                e = validData(dataContainer.form);
                if (e) {
                    messageError(e[0].msg);
                    return;
                }
                if (!valid) return;
                /** 向后端提交 */
                messageSuccess('提交成功！');
            });
        }
        /**
         * 数据验证
         * 外部可调用
         *  */
        function validData(data) {
            const failData = verifiedData(data, {
                name: {
                    msg: '昵称 不能为空',
                    validate(value, option) {
                        if (!value && value !== 0) return false;
                        return true;
                    },
                },
            });
            return failData;
        }
        /** 展示图片选择 */
        function changeImg() {
            if (!ChangeImgDialogRef.value) return;
            ChangeImgDialogRef.value
                .initData(true, {
                    url: dataContainer.imgUrl_3,
                })
                .then((res) => {
                    dataContainer.imgUrl_3 = res.url || '';
                    otherDataContainer.imgFile = res.file || null;
                })
                .catch(() => {
                    return;
                });
        }
        /** 手动上传文件 */
        function handleUpload() {
            if (!otherDataContainer.imgFile) return;
            if (!UploadSingleImgRef.value) return;
            UploadSingleImgRef.value
                .handleUpload(otherDataContainer.imgFile)
                .then(() => {
                    /** 此处可以想后端提交保存的信息 */
                })
                .catch(() => {
                    return;
                });
        }
        /** 上传组件成功事件 */
        function handleUploadSuccess() {
            messageSuccess(`文件上传成功`);
        }
        /** 上传组件失败事件 */
        function handleUploadFail() {
            messageError(`文件上传失败`);
        }
        /** 上传组件取消事件 */
        function handleUploadCancel() {
            dataContainer.imgUrl_3 = '';
            otherDataContainer.imgFile = null;
        }
        return {
            dataContainer,
            FormElRef,
            handleSubmit,
            ChangeImgDialogRef,
            changeImg,
            handleUploadSuccess,
            handleUploadFail,
            handleUploadCancel,
            UploadSingleImgRef,
            handleUpload,
        };
    },
});
</script>

<style lang="scss" scoped>
.mine-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    > .img-container {
        margin-bottom: 15px;
        > * {
            margin-bottom: 15px;
            &:last-child {
                margin: 0;
            }
        }
        .img-upload {
            width: auto;
            height: auto;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 150px;
            > .bt {
                position: absolute;
                cursor: pointer;
                background-color: white;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                box-shadow: 2px 5px 8px rgba(60, 64, 67, 0.15), 0px 2px 2px rgba(60, 64, 67, 0.3);
            }
        }
    }
    > .container {
        width: 100%;
        max-width: 700px;
        padding: 15px 15px 15px 15px;
        box-sizing: border-box;
        background-color: white;
        border-radius: 5px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: column;
    }
}
</style>
