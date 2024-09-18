<script>
/**
 * navbar组件
 */
import { ref, defineComponent, reactive, toRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import userAvatar from '@/components/userAvatar.vue';
import { userDataStore } from '@/store/user';
import { useDialog, useMessage } from 'naive-ui';
import definDropdown from '@/components/definDropdown.vue';

export default defineComponent({
    name: 'Navbar',
    components: {
        SvgIcon,
        userAvatar,
        definDropdown,
    },
    props: {},
    setup(props, { emit }) {
        const message = useMessage();
        const dialog = useDialog();
        let userData = userDataStore();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading: false,
            userInfo: toRef(userData, 'userInfo'),
            show: false,
        });
        /** 跳转页面 */
        function toPath(path) {
            router.push(path);
        }
        /** 退出登录 */
        function handleLogout() {
            dialog.warning({
                title: '退出登录？',
                content: '你确定？',
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                    userData.setUserInfo({});
                    router.push('/login');
                },
                onNegativeClick: () => {
                    message.error('不确定');
                },
            });
        }
        return {
            dataContainer,
            toPath,
            handleLogout,
        };
    },
});
</script>

<template>
    <div class="navbar-cp">
        <div class="top">
            <div class="user-container">
                <div @click="toPath('/main/mine/info')" class="user">
                    <userAvatar :userInfo="dataContainer.userInfo"></userAvatar>
                </div>
                <div class="name">
                    <SvgIcon
                        :style="'width: 20px;min-width:20px;height: 20px;'"
                        :name="'svg:user-fill.svg'"
                    ></SvgIcon>
                    <span>
                        {{ dataContainer.userInfo.nickName }}
                    </span>
                </div>
            </div>
            <definDropdown
                :show="dataContainer.show"
                :ifLeftClick="true"
                :targetQuery="'.target'"
                @onOtherClick="dataContainer.show = false"
                @onClick="
                    () => {
                        dataContainer.show = !dataContainer.show;
                    }
                "
                position="outside,right,start"
            >
                <SvgIcon
                    :style="'width: 22px;min-width:22px;height: 22px;cursor: pointer;'"
                    :name="'svg:cog-fill.svg'"
                    class="target"
                ></SvgIcon>
                <template v-slot:dropdown>
                    <div class="bt-list-container">
                        <div @click="toPath('/main/mine/info-update')" class="item">
                            <SvgIcon
                                :style="'width: 17px;min-width:17px;height: 17px;'"
                                :name="'svg:user-fill.svg'"
                            ></SvgIcon>
                            修改用户基本信息
                        </div>
                        <div @click="toPath('/main/mine/info-password')" class="item">
                            <SvgIcon
                                :style="'width: 17px;min-width:17px;height: 17px;'"
                                :name="'svg:cat-code.svg'"
                            ></SvgIcon>
                            修改用户密码
                        </div>
                        <div @click="handleLogout" class="item logout">
                            <SvgIcon
                                :style="'width: 17px;min-width:17px;height: 17px;'"
                                :name="'svg:poweroff.svg'"
                            ></SvgIcon>
                            退出登录
                        </div>
                    </div>
                </template>
            </definDropdown>
            <a href="https://gitee.com/wuzhanggui/dumogu-admin" target="_blank" class="bt">
                <SvgIcon :style="'width:22px;height:22px;'" name="img:gitee.svg"></SvgIcon>
            </a>
            <a href="https://github.com/wurencaideli/dumogu-admin" target="_blank" class="bt">
                <SvgIcon :style="'width:22px;height:22px;'" name="svg:git-hub.svg"></SvgIcon>
            </a>
            <a href="https://txc.qq.com/products/613546" target="_blank" class="bt">
                <SvgIcon :style="'width:22px;height:22px;'" name="svg:fankui.svg"></SvgIcon>
                <div class="number">
                    <div class="container">12</div>
                </div>
            </a>
        </div>
        <div class="bottom">
            <div class="index" @click="handleLogout">
                <SvgIcon
                    :style="'width: 17px;min-width:17px;height: 17px;margin-right:5px;'"
                    :name="'svg:poweroff.svg'"
                ></SvgIcon>
                退出
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.navbar-cp {
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
            margin-bottom: 30px;
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
                    font-size: 15px;
                    letter-spacing: 1.5px;
                    font-weight: bold;
                    text-shadow: 1px 1px 0px #000;
                }
            }
        }
        > .search {
            width: fit-content;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        :deep(.defin-drop) {
            z-index: 999;
            .bt-list-container {
                opacity: 1 !important;
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
                transform: scale(1.2);
            }
            > .number {
                height: fit-content;
                width: auto;
                position: absolute;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                top: -10px;
                right: -10px;
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
            cursor: pointer;
        }
    }
}
</style>
