<script>
/**
 * 密码修改页面
 */
import { defineComponent, ref, reactive } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { verifiedData } from '@/common/verifiedTools';
import { useMessage } from 'naive-ui';
import { toTrim } from '@/common/otherTools';
import { throttleFn } from '@/common/debounceAndThrottle';

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        const message = useMessage();
        const FormElRef = ref(null); //组件实例
        const dataContainer = reactive({
            loading: false,
            form: {},
            rules: {
                oldPassword: [
                    { required: true, message: '请输入密码', trigger: ['input', 'blur'] },
                ],
                password: [{ required: true, message: '请输入新密码', trigger: ['input', 'blur'] }],
                password_: [
                    {
                        required: true,
                        message: '请确认密码',
                        trigger: ['input', 'blur'],
                        level: 'warning',
                        validator(_rule, value) {
                            if (value !== dataContainer.form.password) {
                                return new Error('两次密码不一致');
                            }
                            return true;
                        },
                    },
                ],
            },
        });
        /** 提交数据 */
        /** 保存操作 */
        const handleSubmit = throttleFn(function () {
            if (!FormElRef.value || dataContainer.loading) return;
            FormElRef.value.validate((errors, { warnings }) => {
                if (errors) {
                    message.error('校验未通过');
                    return;
                } else if (warnings) {
                    message.warning('校验通过但是留意还有警告');
                    return;
                }
                const verifiedData = validBase(dataContainer.form);
                if (verifiedData) {
                    message.error('参数错误！' + verifiedData[0].label);
                    return;
                }
                // 可以提交数据了
                message.success('数据提交了');
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
            <n-form
                :model="dataContainer.form"
                ref="FormElRef"
                :inline="false"
                :rules="dataContainer.rules"
                label-width="120px"
                style="width: 100%"
            >
                <n-grid :x-gap="12" :y-gap="8" :cols="1">
                    <n-grid-item>
                        <n-form-item label="原密码" path="oldPassword">
                            <n-input
                                @input="
                                    () => {
                                        dataContainer.form.oldPassword = toTrim(
                                            dataContainer.form.oldPassword,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model:value="dataContainer.form.oldPassword"
                            >
                            </n-input>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item>
                        <n-form-item label="新密码" path="password">
                            <n-input
                                @input="
                                    () => {
                                        dataContainer.form.password = toTrim(
                                            dataContainer.form.password,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model:value="dataContainer.form.password"
                            >
                            </n-input>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item>
                        <n-form-item label="确认密码" path="password_">
                            <n-input
                                @input="
                                    () => {
                                        dataContainer.form.password_ = toTrim(
                                            dataContainer.form.password_,
                                        );
                                    }
                                "
                                :clearable="true"
                                v-model:value="dataContainer.form.password_"
                            >
                            </n-input>
                        </n-form-item>
                    </n-grid-item>
                </n-grid>
            </n-form>
            <n-button type="primary" @click="handleSubmit"> 提交 </n-button>
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
