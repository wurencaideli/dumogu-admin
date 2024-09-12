<script>
/**
 * layout 的公共head组件
 */
import {
    ref,
    defineComponent,
    h,
    reactive,
    watch,
    toRef,
    computed,
    onMounted,
    onUnmounted,
    onBeforeUnmount,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import userAvatar from '@/components/userAvatar.vue';
import { userDataStore } from '@/store/user';

export default defineComponent({
    name: 'MainHead',
    components: {
        SvgIcon,
        userAvatar,
    },
    props: {},
    emits: ['onInitData', 'onGetInfo'],
    setup(props, { emit }) {
        let userData = userDataStore();
        const router = useRouter();
        const route = useRoute();
        const SetupRef = ref(null);
        const dataContainer = reactive({
            loading: false,
            userInfo: toRef(userData, 'userInfo'),
            show: false,
        });
        function initHiddenEvent(event) {
            const e = event || window.event;
            if (!SetupRef.value) return;
            if (SetupRef.value.contains(e.target)) return; //如果点击事件在组件上不做处理
            dataContainer.show = false;
        }
        document.addEventListener('click', initHiddenEvent);
        onBeforeUnmount(() => {
            document.addEventListener('click', initHiddenEvent);
        });
        /** 跳转页面 */
        function toPath(path) {
            router.push(path);
        }
        /** 退出登录 */
        function handleLogout() {
            ElMessageBox.confirm('退出登录？', '确定退出？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
            })
                .then(() => {
                    if (dataContainer.loading) return;
                    dataContainer.loading = true;
                    userApi
                        .logout()
                        .then(() => {
                            ElMessage({
                                type: 'success',
                                message: '已经成功退出！',
                            });
                        })
                        .catch((res) => {
                            ElMessage.error('退出失败：' + res.msg);
                        })
                        .finally(() => {
                            userDataStore.setToken('');
                            userDataStore.setUserInfo({});
                            router.push('/login');
                            dataContainer.loading = false;
                        });
                })
                .catch(() => {});
        }
        return {
            dataContainer,
            toPath,
            SetupRef,
            handleLogout,
        };
    },
});
</script>

<template>
    <div class="main-head-cp">
        <div class="top">
            <div class="user-container">
                <div @click="toPath('/manage/' + dataContainer.userInfo.name)" class="user">
                    <userAvatar :userInfo="dataContainer.userInfo"></userAvatar>
                </div>
                <div class="name">
                    <SvgIcon
                        :style="'width: 20px;min-width:20px;height: 20px;'"
                        :name="'svg:user-fill.svg'"
                    ></SvgIcon>
                    <span>
                        {{ dataContainer.userInfo.userName }}
                    </span>
                </div>
            </div>
            <div ref="SetupRef" class="setup">
                <SvgIcon
                    :style="'width: 20px;min-width:20px;height: 20px;cursor: pointer;'"
                    :name="'svg:cog-fill.svg'"
                    @click="dataContainer.show = !dataContainer.show"
                ></SvgIcon>
                <div
                    :class="{
                        'bt-list': true,
                        show: dataContainer.show,
                    }"
                >
                    <div class="item">
                        <SvgIcon
                            :style="'width: 15px;min-width:15px;height: 15px;margin-right:10px;'"
                            :name="'svg:user-fill.svg'"
                        ></SvgIcon>
                        修改用户基本信息
                    </div>
                    <div class="item">
                        <SvgIcon
                            :style="'width: 15px;min-width:15px;height: 15px;margin-right:10px;'"
                            :name="'svg:cat-code.svg'"
                        ></SvgIcon>
                        修改用户密码
                    </div>
                    <div class="item logout">
                        <SvgIcon
                            :style="'width: 15px;min-width:15px;height: 15px;margin-right:10px;'"
                            :name="'svg:poweroff.svg'"
                        ></SvgIcon>
                        退出登录
                    </div>
                </div>
            </div>
            <a href="https://gitee.com/wuzhanggui/dumogu-admin" target="_blank" class="bt">
                <SvgIcon :style="'width:25px;height:25px;'" name="img:gitee.svg"></SvgIcon>
            </a>
            <a href="https://github.com/wurencaideli/dumogu-admin" target="_blank" class="bt">
                <SvgIcon :style="'width:25px;height:25px;'" name="svg:git-hub.svg"></SvgIcon>
            </a>
            <a href="https://txc.qq.com/products/613546" target="_blank" class="bt">
                <SvgIcon :style="'width:25px;height:25px;'" name="svg:fankui.svg"></SvgIcon>
                <div class="number">
                    <div class="container">12</div>
                </div>
            </a>
        </div>
        <div class="bottom">
            <router-link to="/" class="index">
                <SvgIcon
                    :style="'width: 15px;min-width:15px;height: 15px;margin-right:5px;'"
                    :name="'svg:arrow-left.svg'"
                ></SvgIcon>
                首页
            </router-link>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-head-cp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    --text-color: #94abbe;
    > .top {
        box-sizing: border-box;
        padding: 10px 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--text-color);
        > * {
            margin-bottom: 20px;
        }
        > .user-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            > .user {
                height: 50px;
                width: 50px;
                border-radius: 50%;
                border: 2px solid var(--text-color);
                box-sizing: border-box;
                background-color: #1f364d;
                cursor: pointer;
                box-shadow: var(--bt-box-shadow-1);
                margin-bottom: 15px;
                position: relative;
                > .role {
                    position: absolute;
                    right: -15px;
                    bottom: -15px;
                    transform: scale(0.5);
                    font-size: 12px;
                    background-color: rgb(0 90 180);
                    color: rgb(215, 215, 215);
                    border: 1px solid;
                    border-color: rgb(0 127 255);
                    border-radius: 999px;
                    padding: 5px 10px;
                    width: max-content;
                    box-shadow: var(--bt-box-shadow-1);
                }
            }
            > .name {
                font-size: 13px;
                font-weight: bold;
                width: fit-content;
                // color: rgb(215, 215, 215);
                display: flex;
                flex-direction: column;
                align-items: center;
                > * {
                    margin-bottom: 5px;
                }
                span {
                    writing-mode: vertical-rl;
                    margin: 0;
                    font-size: 16px;
                    font-weight: bold;
                    text-shadow: 1px 3px 0px #000;
                }
            }
        }
        > .search {
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        > .setup {
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            > .bt-list {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 0;
                left: calc(100% + 5px);
                width: max-content;
                z-index: 9;
                background-color: #1f1f23;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0px 4px rgba(0, 0, 0, 0.4);
                padding: 20px 0;
                box-sizing: border-box;
                border-radius: 12px;
                border: 1px solid #ffffff12;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                transition: all 0.2s;
                transform: scale(0);
                &.show {
                    opacity: 1;
                    pointer-events: initial;
                    transform: scale(1);
                }
                > .item {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    padding: 15px 10px;
                    box-sizing: border-box;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: rgb(206, 206, 206);
                    border-bottom: 1px solid #ffffff12;
                    border-left: none;
                    border-right: none;
                    &:hover {
                        background-color: rgba(145, 145, 162, 0.17);
                        color: #007fff;
                    }
                    &:first-child {
                        border-top: 1px solid #ffffff12;
                    }
                    &.logout {
                        color: #c95050;
                    }
                }
            }
        }
        > .login {
            width: calc(100% - 10px);
            padding: 0 5px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            box-sizing: content-box;
            border: 2px solid #2c4967;
            color: #9cb3c9;
            border-radius: 999px;
            box-shadow: var(--bt-box-shadow-1);
            > * {
                font-size: 15px;
                margin-left: 5px;
            }
        }
        > .bt {
            width: 35px;
            height: 35px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border-radius: 999px;
            box-sizing: border-box;
            transition: all 0.2s;
            position: relative;
            &:hover {
                background-color: #000000af;
            }
            > .number {
                height: 200%;
                width: auto;
                position: absolute;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                bottom: 0;
                right: -5px;
                pointer-events: none;
                > .container {
                    transform: scale(0.8) translateY(3px);
                    font-size: 12px;
                    background-color: #fef0f0;
                    color: #f56c6c;
                    border-radius: 5px;
                    padding: 0px 3px;
                    line-height: 1.2;
                    border: 1px solid #fab6b6;
                    font-weight: bold;
                }
            }
        }
    }
    > .bottom {
        padding: 10px 0;
        color: var(--text-color);
        > .index {
            font-size: 13px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
