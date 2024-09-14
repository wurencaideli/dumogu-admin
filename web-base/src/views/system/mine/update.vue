<script>
/**
 * 头像修改页面
 */
import { defineComponent, ref, reactive } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { verifiedData } from '@/common/verifiedTools';
import { messageError, messageSuccess } from '@/action/messagePrompt.js';
import { toTrim } from '@/common/otherTools';
import { throttleFn } from '@/common/debounceAndThrottle';
import { userDataStore } from '@/store/user';

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        let userData = userDataStore();
        const FormElRef = ref(null); //组件实例
        const dataContainer = reactive({
            loading: false,
            form: {},
            rules: {
                nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                avatar: [{ required: true, message: '请输入头像', trigger: 'blur' }],
            },
        });
        /** 初始化数据 */
        function initData() {
            Object.assign(dataContainer.form, userData.userInfo);
        }
        initData();
        /** 提交数据 */
        /** 保存操作 */
        const handleSubmit = throttleFn(function () {
            if (!FormElRef.value || dataContainer.loading) return;
            FormElRef.value.validate((valid, e) => {
                if (!valid) {
                    const message = e[Object.keys(e)[0]][0].message;
                    messageError(message);
                    return;
                }
                const verifiedData = validBase(dataContainer.form);
                if (verifiedData) {
                    messageError('参数错误！' + verifiedData[0].label);
                    return;
                }
                // 可以提交数据了
                messageSuccess('数据提交了');
                userData.setUserInfo(Object.assign({}, userData.userInfo, dataContainer.form));
            });
        }, 700);
        /**
         * 数据验证
         * 外部可调用
         *  */
        /** 验证信息 */
        function validBase(data) {
            const failData = verifiedData(data, {
                nickName: {
                    label: 'nickName:昵称',
                    validate(value, option) {
                        if (!value && value !== 0) {
                            option.label = option.label + ' 不能为空';
                            return false;
                        }
                        if (Object.prototype.toString.call(value) !== '[object String]') {
                            option.label = option.label + ' 必须是一个字符串';
                            return false;
                        }
                        if (value.length > 300) {
                            option.label = option.label + ' 字符长度长度超出300';
                            return false;
                        }
                        return true;
                    },
                },
                avatar: {
                    label: 'avatar:头像',
                    validate(value, option) {
                        if (!value && value !== 0) {
                            option.label = option.label + ' 不能为空';
                            return false;
                        }
                        if (Object.prototype.toString.call(value) !== '[object String]') {
                            option.label = option.label + ' 必须是一个字符串';
                            return false;
                        }
                        if (value.length > 300) {
                            option.label = option.label + ' 字符长度长度超出300';
                            return false;
                        }
                        return true;
                    },
                },
            });
            return failData;
        }
        return {
            dataContainer,
            FormElRef,
            handleSubmit,
            toTrim,
        };
    },
});
</script>

<template>
    <div class="page-container mine-update-view">
        <div class="container">
            <el-image class="img" :src="dataContainer.form.avatar" fit="cover" />
            <el-form
                :model="dataContainer.form"
                ref="FormElRef"
                :inline="false"
                :rules="dataContainer.rules"
                label-width="120px"
                style="width: 100%"
            >
                <el-row :gutter="0">
                    <el-col :span="24">
                        <el-form-item label="昵称" prop="nickName">
                            <el-input
                                @input="
                                    () => {
                                        dataContainer.form.nickName = toTrim(
                                            dataContainer.form.nickName,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model="dataContainer.form.nickName"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="头像" prop="avatar">
                            <el-input
                                @input="
                                    () => {
                                        dataContainer.form.avatar = toTrim(
                                            dataContainer.form.avatar,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model="dataContainer.form.avatar"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.mine-update-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    > .container {
        width: 100%;
        max-width: 700px;
        padding: 60px 15px;
        box-sizing: border-box;
        background-color: var(--bg-color);
        border-radius: 12px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: column;
        > .img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-bottom: 60px;
            border: 2px solid rgba(0, 0, 0, 0.421);
        }
    }
}
</style>
