<script>
/**
 * 登录页面
 *  */
import { defineComponent, ref, reactive, computed, onMounted, onActivated } from 'vue';
import publicApi from '@/http/public.js';
import userApi from '@/http/user.js';
import { messageSuccess, messageError } from '@/action/messagePrompt';
import { useRoute, useRouter } from 'vue-router';
import { throttleFn_1 as throttleFn } from '@/common/debounceAndThrottle';
import { verifiedData } from '@/common/verifiedTools';
import { Select, ArrowRightBold, SemiSelect } from '@element-plus/icons-vue';
import { userDataStore } from '@/store/user';
import img_1 from '@/assets/login-imgs/img-1.gif';
import img_2 from '@/assets/login-imgs/login-bg.svg';
import img_3 from '@/assets/login-imgs/code.svg';
import img_4 from '@/assets/login-imgs/login-bg-1.svg';
import img_5 from '@/assets/login-imgs/login-bg-2.svg';
import img_6 from '@/assets/login-imgs/login-bg-3.svg';
import img_7 from '@/assets/login-imgs/login-bg-4.png';

export default defineComponent({
    name: 'LoginView',
    components: {
        Select,
        ArrowRightBold,
        SemiSelect,
    },
    setup() {
        const userData = userDataStore();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
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
                img_1,
                img_2,
                img_3,
                img_4,
                img_5,
                img_6,
                img_7,
            },
        });
        /** 验证信息 */
        function validBase(data) {
            const failData = verifiedData(data, {
                name: {
                    label: '账号 : 不能为空 && 长度1-150',
                    validate(value) {
                        if (!value && value !== 0) return false;
                        value = String(value);
                        if (value.length < 1) return false;
                        if (value.length > 150) return false;
                        return true;
                    },
                },
                password: {
                    label: '密码 : 不能为空 && 长度1-150',
                    validate(value) {
                        if (!value && value !== 0) return false;
                        value = String(value);
                        if (value.length < 1) return false;
                        if (value.length > 150) return false;
                        return true;
                    },
                },
                captchaText: {
                    label: '验证码 : 不能为空 && 长度1-7',
                    validate(value) {
                        if (!value && value !== 0) return false;
                        value = String(value);
                        if (value.length < 1) return false;
                        if (value.length > 7) return false;
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
                    messageError('验证码获取失败');
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
                messageError('参数错误！' + verifiedData[0].label);
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
                    messageSuccess('登录成功');
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
                    messageError('登录失败：' + res.msg);
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
    <div
        class="login-view"
        :style="{
            '--bg-img-1': `url(${dataContainer.img.img_1})`,
            '--bg-img-2': `url(${dataContainer.img.img_2})`,
        }"
    >
        <div class="img-bg">
            <el-image class="img" :src="dataContainer.img.img_4" fit="contain" />
        </div>
        <div class="container">
            <div class="left">
                <el-carousel :interval="7000" arrow="never">
                    <el-carousel-item>
                        <div class="item">
                            <el-image class="img" :src="dataContainer.img.img_7" fit="contain" />
                            <div class="title">直接上手</div>
                            <div class="content">只用写好自己的业务页面</div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item>
                        <div class="item">
                            <el-image
                                class="img img-1"
                                :src="dataContainer.img.img_5"
                                fit="contain"
                            />
                            <div class="title">代码简单</div>
                            <div class="content">代码简洁易懂，遇到问题好解决</div>
                        </div>
                    </el-carousel-item>
                    <el-carousel-item>
                        <div class="item">
                            <el-image
                                class="img img-2"
                                :src="dataContainer.img.img_6"
                                fit="contain"
                            />
                            <div class="title">界面</div>
                            <div class="content">清新小巧，布局合理</div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="right">
                <div class="container">
                    <div class="title">登 录</div>
                    <div class="other-login-bt">
                        <div class="item">
                            <SvgIcon :style="'width:20px;height:20px;'" name="svg:g.svg"></SvgIcon>
                        </div>
                        <div class="item">
                            <SvgIcon :style="'width:20px;height:20px;'" name="svg:f.svg"></SvgIcon>
                        </div>
                        <div class="item">
                            <SvgIcon
                                :style="'width:20px;height:20px;'"
                                name="svg:weixin.svg"
                            ></SvgIcon>
                        </div>
                    </div>
                    <div class="content-1">或使用您的账号</div>
                    <div class="input-container">
                        <SvgIcon
                            :style="'width:20px;height:20px;margin-right:10px;'"
                            name="svg:zhanghao.svg"
                        ></SvgIcon>
                        <el-input
                            clearable
                            @input="
                                () => {
                                    toTrim(dataContainer.form, 'name');
                                    palindrome(dataContainer.form, 'name');
                                }
                            "
                            placeholder="账号"
                            @keyup.enter="onLogin"
                            v-model="dataContainer.form.name"
                        />
                    </div>
                    <div class="input-container">
                        <SvgIcon
                            :style="'width:20px;height:20px;margin-right:10px;'"
                            name="svg:mima.svg"
                        ></SvgIcon>
                        <el-input
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
                            v-model="dataContainer.form.password"
                        />
                    </div>
                    <div class="input-container code">
                        <SvgIcon
                            :style="'width:20px;height:20px;margin-right:10px;'"
                            name="svg:cat-code.svg"
                        ></SvgIcon>
                        <el-input
                            v-model="dataContainer.form.captchaText"
                            placeholder="验证码"
                            clearable
                            @keyup.enter="onLogin"
                        >
                        </el-input>
                        <el-image class="img" :src="dataContainer.img.img_3" fit="cover" />
                    </div>
                    <div class="bt-list">
                        <el-button
                            class="login-bt"
                            v-if="!dataContainer.form.idU"
                            :loading="dataContainer.loading"
                            @click="onLogin"
                        >
                            登 录
                        </el-button>
                    </div>
                    <div class="other">
                        （没有后台接口，随便输入必填项就可以登录）
                        <!-- <router-link to="/register">
                            没有账号？去注册
                        </router-link> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            版权所有 @admin.dumogu.top 毒蘑菇 - 管理
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
    background-image: var(--bg-img-2);
    // background-size: cover;
    // backdrop-filter: blur(12px);
    background-size: contain;
    background-position: center bottom;
    background-repeat: no-repeat;
    // background: #007FFF;
    // background: linear-gradient(to right,rgba(0, 128, 255, 0.421),rgba(0, 89, 178, 0.421));
    padding: 15px;
    box-sizing: border-box;
    color: rgb(32, 32, 32);
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
            width: 90%;
            height: 90%;
        }
    }
    > .container {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 900px;
        background-color: rgb(255, 255, 255);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.449);
        > .left {
            flex: 1 1 0;
            width: 0;
            // background-image: var(--bg-img-1);
            // background-size: cover;
            // box-shadow: inset 1px 0px 4px #0000006b;
            background-color: #e9e9e9;
            background-repeat: no-repeat;
            :deep(.el-carousel) {
                width: 100%;
                height: 100%;
                .el-carousel__container {
                    width: 100%;
                    height: 100%;
                    .item {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        > .img {
                            width: 100%;
                            max-width: 200px;
                            height: 100%;
                            max-height: 200px;
                            transform: scale(1.5) translateY(-40px);
                            &.img-1 {
                                transform: scale(1.7) translateY(-15px) translateX(-10px);
                            }
                            &.img-2 {
                                transform: scale(1.5) translateY(-30px);
                            }
                        }
                        > .title {
                            font-size: 20px;
                            color: #000000;
                            margin: 10px 0 0 0;
                            font-weight: bold;
                            position: absolute;
                            bottom: 80px;
                        }
                        > .content {
                            font-size: 15px;
                            color: #000000;
                            opacity: 0.7;
                            margin-top: 15px;
                            position: absolute;
                            bottom: 50px;
                        }
                    }
                }
                .el-carousel__indicators {
                    bottom: 10px;
                    --el-carousel-indicator-width: 40px;
                    --el-carousel-indicator-height: 7px;
                    .is-active {
                        .el-carousel__button {
                            width: 60px;
                            opacity: 1;
                        }
                    }
                    .el-carousel__button {
                        border-radius: 3px;
                        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.204);
                        background-color: #0059b2;
                        background: linear-gradient(to right, #007fff, #0059b2);
                        opacity: 0.3;
                    }
                }
            }
        }
        > .right {
            flex: 1 1 0;
            width: 0;
            > .container {
                width: 100%;
                height: 100%;
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
                    :deep(.el-input) {
                        flex: 1 1 0;
                        width: 0;
                        border: none;
                        box-shadow: none;
                        outline: none;
                        background-color: transparent;
                        .el-input__wrapper {
                            border: none;
                            box-shadow: none;
                            outline: none;
                            background-color: transparent;
                            padding: 0;
                            input {
                                font-size: 17px;
                            }
                        }
                        .el-input__suffix {
                            .el-icon {
                                font-size: 20px !important;
                                color: #3c3c3c !important;
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
            margin: 0 15px;
        }
    }
}
</style>
