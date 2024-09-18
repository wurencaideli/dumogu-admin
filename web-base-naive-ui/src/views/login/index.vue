<script>
/**
 * 登录页面
 *  */
import { defineComponent, reactive } from 'vue';
import publicApi from '@/http/public.js';
import userApi from '@/http/user.js';
import { useRoute, useRouter } from 'vue-router';
import { throttleFn_1 as throttleFn } from '@/common/debounceAndThrottle';
import { verifiedData } from '@/common/verifiedTools';
import { userDataStore } from '@/store/user';
import { getTypeOf } from '@/common/otherTools';
import { useMessage } from 'naive-ui';
import img_2 from '@/assets/login-imgs/login-bg.svg';
import img_3 from '@/assets/login-imgs/code.svg';
import img_4 from '@/assets/login-imgs/login-bg-1.svg';

export default defineComponent({
    name: 'LoginView',
    components: {},
    setup() {
        const message = useMessage();
        const userData = userDataStore();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            name: import.meta.env.VITE_APP_name,
            form: {
                name: '',
                password: '',
                captchaText: '',
            },
            loading: false,
            captchaSvg: '',
            captchaId: '',
            loading_1: false,
            img: {
                img_2,
                img_3,
                img_4,
            },
        });
        /** 验证信息 */
        function validBase(data) {
            const failData = verifiedData(data, {
                name: {
                    label: '',
                    validate(value, option) {
                        let label = 'name:账号';
                        var regex = /^[A-Za-z0-9-_]+$/;
                        if (!value && value !== 0) {
                            option.label = label + ' 不能为空';
                            return false;
                        }
                        if (getTypeOf(value) !== '[object String]') {
                            option.label = label + ' 必须是一个字符串';
                            return false;
                        }
                        if (value.length > 70) {
                            option.label = label + ' 字符长度长度超出70';
                            return false;
                        }
                        let isPass = regex.test(value);
                        if (!isPass) {
                            option.label = label + ' 只能是英文，数字，下划线，中划线';
                            return false;
                        }
                        return true;
                    },
                },
                password: {
                    label: '',
                    validate(value, option) {
                        let label = 'password:密码';
                        if (!value && value !== 0) {
                            option.label = label + ' 不能为空';
                            return false;
                        }
                        if (getTypeOf(value) !== '[object String]') {
                            option.label = label + ' 必须是一个字符串';
                            return false;
                        }
                        if (value.length > 300) {
                            option.label = label + ' 字符长度长度超出300';
                            return false;
                        }
                        return true;
                    },
                },
                captchaText: {
                    label: '',
                    validate(value, option) {
                        let label = 'captchaText:验证码';
                        if (!value && value !== 0) {
                            option.label = label + ' 不能为空';
                            return false;
                        }
                        if (getTypeOf(value) !== '[object String]') {
                            option.label = label + ' 必须是一个字符串';
                            return false;
                        }
                        if (value.length > 7) {
                            option.label = label + ' 字符长度长度超出7';
                            return false;
                        }
                        return true;
                    },
                },
            });
            return failData;
        }
        /** 获取验证码 */
        const getCaptcha = throttleFn(function () {
            if (dataContainer.loading_1) return;
            dataContainer.loading_1 = true;
            publicApi
                .getCaptcha()
                .then((res) => {
                    const data = res.data || {};
                    dataContainer.captchaId = data.id;
                    dataContainer.captchaSvg = data.svg;
                    dataContainer.form.captchaText = '';
                })
                .catch(() => {
                    message.error('验证码获取失败');
                })
                .finally(() => {
                    dataContainer.loading_1 = false;
                });
        }, 700);
        getCaptcha();
        /** 登录操作 */
        const onLogin = throttleFn(function (otherParmas) {
            if (dataContainer.loading) return;
            const verifiedData = validBase(dataContainer.form);
            if (verifiedData) {
                message.error('参数错误！' + verifiedData[0].label);
                return;
            }
            dataContainer.loading = true;
            const params = {
                ...dataContainer.form,
                ...otherParmas,
            };
            params.captchaId = dataContainer.captchaId;
            userApi
                .login(params)
                .then(async (res) => {
                    let data = res || {};
                    dataContainer.form.password = '';
                    /** 写入全局数据 */
                    userData.setUserInfo({
                        token: data.token || '',
                    });
                    message.success('登录成功');
                    /**
                     * 登录成功，跳转到首页
                     * 其他用户信息会在路由跳转是获取到
                     *  */
                    let routeParams = route.query || {};
                    if (routeParams.from) {
                        router.push(decodeURIComponent(routeParams.from));
                    } else {
                        router.push('/');
                    }
                })
                .catch((res) => {
                    message.error('登录失败：' + res.msg);
                })
                .finally(() => {
                    dataContainer.loading = false;
                    getCaptcha();
                });
        }, 700);
        /** 去除首尾空格 */
        function toTrim(data, p) {
            let str = data[p];
            str = (str || '').replace(/^\s+|\s+$/g, '');
            data[p] = str;
        }
        /** 去除特殊符号 */
        function palindrome(data, p) {
            let str = data[p];
            str = (str || '').replace(
                /[`:~!#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ~！#￥%……&*（） \+ ={}|《》？：“”【】、；‘’，。、]/g,
                '',
            );
            data[p] = str;
        }
        return {
            dataContainer,
            onLogin,
            getCaptcha,
            toTrim,
            palindrome,
        };
    },
});
</script>

<template>
    <div class="login-view">
        <div class="img-bg img-bg-1">
            <n-image class="img" :src="dataContainer.img.img_2" fit="cover" />
        </div>
        <div class="img-bg">
            <n-image class="img" :src="dataContainer.img.img_4" fit="contain" />
        </div>
        <div class="container">
            <div class="title">登 录</div>
            <div class="other-login-bt">
                <div class="item">
                    <SvgIcon :style="'width:25px;height:25px;'" name="svg:g.svg"></SvgIcon>
                </div>
                <div class="item">
                    <SvgIcon :style="'width:25px;height:25px;'" name="svg:f.svg"></SvgIcon>
                </div>
                <div class="item">
                    <SvgIcon :style="'width:25px;height:25px;'" name="svg:weixin.svg"></SvgIcon>
                </div>
            </div>
            <div class="content-1">或使用您的账号</div>
            <div class="input-container">
                <SvgIcon
                    :style="'width:20px;height:20px;margin-right:10px;'"
                    name="svg:zhanghao.svg"
                ></SvgIcon>
                <n-input
                    clearable
                    @input="
                        () => {
                            toTrim(dataContainer.form, 'name');
                            palindrome(dataContainer.form, 'name');
                        }
                    "
                    placeholder="账号"
                    @keyup.enter="onLogin"
                    v-model:value="dataContainer.form.name"
                />
            </div>
            <div class="input-container">
                <SvgIcon
                    :style="'width:20px;height:20px;margin-right:10px;'"
                    name="svg:mima.svg"
                ></SvgIcon>
                <n-input
                    type="password"
                    clearable
                    @keyup.enter="onLogin"
                    show-password
                    placeholder="密码"
                    @input="
                        () => {
                            toTrim(dataContainer.form, 'password');
                        }
                    "
                    v-model:value="dataContainer.form.password"
                />
            </div>
            <div class="input-container code">
                <SvgIcon
                    :style="'width:20px;height:20px;margin-right:10px;'"
                    name="svg:cat-code.svg"
                ></SvgIcon>
                <n-input
                    v-model:value="dataContainer.form.captchaText"
                    placeholder="验证码"
                    clearable
                    @keyup.enter="onLogin"
                >
                </n-input>
                <n-image class="img" :src="dataContainer.img.img_3" fit="cover" />
            </div>
            <div class="bt-list">
                <n-button
                    class="login-bt"
                    v-if="!dataContainer.form.idU"
                    :loading="dataContainer.loading"
                    @click="onLogin"
                >
                    登 录
                </n-button>
            </div>
            <div class="other">（没有后台接口，随便输入必填项就可以登录）</div>
        </div>
        <div class="bottom">
            版权所有 @admin.dumogu.top {{ dataContainer.name }}
            <a href="https://github.com/wurencaideli/dumogu-admin" target="_blank" class="bt">
                <SvgIcon :style="'width:60px;height:25px;'" name="svg:github.svg"></SvgIcon>
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-view {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    position: relative;
    > .img-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        > .img {
            width: 95%;
            height: 95%;
        }
        &.img-bg-1 {
            > .img {
                width: 100%;
                height: 100%;
            }
        }
    }
    > .container {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 400px;
        background-color: rgb(56, 56, 56);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.449);
        padding: 20px 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        > .title {
            display: flex;
            flex-direction: row;
            justify-content: center;
            font-size: 22px;
            font-weight: bold;
        }
        > .other-login-bt {
            display: flex;
            flex-direction: row;
            justify-content: center;
            justify-content: center;
            margin: 15px 0;
            > .item {
                border: 1px solid #ddd;
                border-radius: 50%;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                margin: 0 10px;
                height: 35px;
                width: 35px;
                cursor: pointer;
                box-shadow: inset 0 1px 4px #0000001f;
            }
        }
        > .content-1 {
            font-size: 13px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            opacity: 0.8;
        }
        > .input-container {
            width: 100%;
            max-width: 300px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background: #eee;
            color: #000;
            border: none;
            padding: 0 15px;
            margin: 20px 0 0 0;
            border-radius: 5px;
            height: 45px;
            box-sizing: border-box;
            transition: all 0.2s;
            box-shadow: inset 0 1px 4px #0000001f;
            &:focus-within {
                box-shadow: inset 0 1px 4px #0000001f, 0 0 0 2px #007fff !important;
            }
            :deep(.n-input) {
                flex: 1 1 0;
                width: 0;
                border: none;
                box-shadow: none;
                outline: none;
                background-color: transparent;
                height: 100%;
                --n-border-hover: none !important;
                --n-border-focus: none !important;
                --n-box-shadow-focus: none !important;
                &:hover {
                    border: none !important;
                    box-shadow: none !important;
                    outline: none !important;
                }
                .n-input-wrapper {
                    border: none;
                    box-shadow: none;
                    outline: none;
                    background-color: transparent;
                    padding: 0 !important;
                    height: 100%;
                    input {
                        font-size: 16px;
                        color: #000;
                        height: 100%;
                    }
                }
            }
            &.code {
                padding: 0 5px 0 15px;
            }
            > .img {
                width: 100px;
                height: calc(100% - 10px);
                margin-left: 15px;
                cursor: pointer;
                border-radius: 5px;
                border: 1px solid rgba(0, 0, 0, 0.156);
            }
        }
        > .bt-list {
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin: 20px 0;
            :deep(.login-bt) {
                border-radius: 999px;
                border: none;
                background: #007fff;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                padding: 12px 60px;
                letter-spacing: 1px;
                height: 45px;
                background: linear-gradient(to right, #007fff, #0059b2);
                box-shadow: 0 3px 3px -2px #0003, 0 3px 4px #00000024, 0 1px 8px #0000001f;
            }
        }
        > .other {
            font-size: 14px;
            opacity: 0.5;
            margin-top: 0;
        }
    }
    > .bottom {
        position: fixed;
        bottom: 15px;
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: white;
        > * {
            margin-left: 5px;
        }
    }
}
</style>
