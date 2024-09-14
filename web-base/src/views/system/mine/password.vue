<script>
/**
 * 密码修改页面
 */
import { defineComponent, ref, reactive } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { verifiedData } from '@/common/verifiedTools';
import { messageError, messageSuccess } from '@/action/messagePrompt.js';
import { toTrim } from '@/common/otherTools';
import { throttleFn } from '@/common/debounceAndThrottle';

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        const FormElRef = ref(null); //组件实例
        const dataContainer = reactive({
            loading: false,
            form: {},
            rules: {
                oldPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                password_: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callBack) => {
                            if (value !== dataContainer.form.password) {
                                callBack(new Error('两次密码不一致'));
                            }
                            callBack();
                        },
                        trigger: 'blur',
                    },
                ],
            },
        });
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
            });
        }, 700);
        /**
         * 数据验证
         * 外部可调用
         *  */
        /** 验证信息 */
        function validBase(data) {
            const failData = verifiedData(data, {
                oldPassword: {
                    label: 'oldPassword:原密码',
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
                password: {
                    label: 'password:密码',
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
    <div class="page-container mine-password-view">
        <div class="container">
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
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input
                                show-password
                                @input="
                                    () => {
                                        dataContainer.form.oldPassword = toTrim(
                                            dataContainer.form.oldPassword,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model="dataContainer.form.oldPassword"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="新密码" prop="password">
                            <el-input
                                show-password
                                @input="
                                    () => {
                                        dataContainer.form.password = toTrim(
                                            dataContainer.form.password,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model="dataContainer.form.password"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="确认密码" prop="password_">
                            <el-input
                                show-password
                                @input="
                                    () => {
                                        dataContainer.form.password_ = toTrim(
                                            dataContainer.form.password_,
                                        );
                                    }
                                "
                                v-model="dataContainer.form.password_"
                                :clearable="true"
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
.mine-password-view {
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
    }
}
</style>
