<template>
    <div class="page-container mine-view">
        <div class="container">
            <el-form
                :model="dataContainer.form"
                ref="FormElRef"
                :inline="false"
                :rules="dataContainer.rules"
                label-width="120px"
            >
                <el-row :gutter="0">
                    <el-col :span="24">
                        <el-form-item label="原密码" prop="password">
                            <el-input
                                v-model="dataContainer.form.password"
                                type="password"
                                placeholder="请输入"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input
                                v-model="dataContainer.form.newPassword"
                                type="password"
                                placeholder="请输入"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="重新输入新密码" prop="newPassword_1">
                            <el-input
                                v-model="dataContainer.form.newPassword_1"
                                type="password"
                                placeholder="请输入"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
        </div>
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
import { verifiedData } from '@/common/verifiedTools';
import { messageError, messageSuccess } from '@/action/messagePrompt.js';

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        const FormElRef = ref(null); //组件实例
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading: false,
            form: {},
            rules: {
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
            },
        });
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
                password: {
                    msg: '密码 不能为空',
                    validate(value, option) {
                        if (!value && value !== 0) return false;
                        return true;
                    },
                },
                newPassword: {
                    msg: '新密码 不能为空',
                    validate(value, option) {
                        if (!value && value !== 0) return false;
                        return true;
                    },
                },
                newPassword_1: {
                    msg: '两次密码不一致',
                    validate(value, option) {
                        return data.newPassword === value;
                    },
                },
            });
            return failData;
        }
        return {
            dataContainer,
            FormElRef,
            handleSubmit,
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
    > .container {
        width: 100%;
        max-width: 700px;
        padding: 30px 15px 15px 15px;
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
