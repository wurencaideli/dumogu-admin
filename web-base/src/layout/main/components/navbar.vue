<script>
/*
 * 头部组件
 * 提供类名供外部调整
 */
import {
    defineComponent,
    ref,
    reactive,
    computed,
    onMounted,
    watch,
    toRef,
    onUnmounted,
} from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import { logout } from '@/action/FormatUserData';
import { confirm } from '@/action/messagePrompt';
import img_1 from '@/assets/logo.png';
import { toggleFullScreen } from '@/common/otherTools';

export default {
    name: 'Navbar',
    components: {
        SvgIcon,
    },
    props: {
        breadcrumbList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        userInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
        showLogo: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['switchShowLogo'],
    setup(props, { emit }) {
        const router = useRouter();
        const RightOptionRef = ref(null);
        const dataContainer = reactive({
            breadcrumbList: toRef(props, 'breadcrumbList'),
            userInfo: toRef(props, 'userInfo'),
            showLogo: toRef(props, 'showLogo'),
            show_1: false,
            img: {
                img_1,
            },
        });
        /** 跳转去相应页面 */
        function toPath(params) {
            router.push(params);
        }
        /** 退出登录 */
        function onLogout() {
            confirm('是否确认退出登录', '提示')
                .then(() => {
                    toPath('/login');
                    /** 跳转成功后注销用户 */
                    let myAfterEach = router.afterEach(() => {
                        logout();
                        /** 注销此函数 */
                        myAfterEach();
                        myAfterEach = null;
                    });
                })
                .catch(() => {
                    return;
                });
        }
        /** 初始化隐藏事件 */
        function initHiddenEvent_1() {
            function callbackFn(e) {
                if (!RightOptionRef.value) return;
                if (!e || !e.target) return;
                if (RightOptionRef.value.contains(e.target)) return;
                dataContainer.show_1 = false;
            }
            document.addEventListener('click', callbackFn);
            onUnmounted(() => {
                document.removeEventListener('click', callbackFn);
            });
        }
        initHiddenEvent_1();
        /** 切换显示状态 */
        function switchShowLogo() {
            emit('switchShowLogo');
        }
        /** 添加打开新标签页的操作 */
        function addNewPage() {
            toPath('/main/new-tag-page/search-new-page');
        }
        /** 添加键盘按下事件监听器 */
        function callBack_1(event) {
            // 检查是否按下了"Alt + S"组合键
            if (event.altKey && event.key && event.key.toLowerCase() === 's') {
                addNewPage();
            }
        }
        document.addEventListener('keydown', callBack_1);
        onUnmounted(() => {
            document.removeEventListener('keydown', callBack_1);
        });
        return {
            dataContainer,
            toPath,
            toggleFullScreen,
            onLogout,
            RightOptionRef,
            switchShowLogo,
            addNewPage,
        };
    },
};
</script>

<template>
    <div class="navbar-cp-container">
        <div class="left">
            <div class="hidden-bt">
                <SvgIcon
                    @click="switchShowLogo"
                    :style="'width:20px;height:20px;'"
                    :name="dataContainer.showLogo ? 'svg:outdent.svg' : 'svg:indent.svg'"
                ></SvgIcon>
            </div>
            <div class="path-list-container">
                <el-breadcrumb separator="">
                    <!-- <el-breadcrumb-item :to="{ path: '/main/index' }"> 首页 </el-breadcrumb-item> -->
                    <el-breadcrumb-item
                        v-for="(item, index) in dataContainer.breadcrumbList"
                        :key="`${index}--${item.path}`"
                        :to="
                            item.path
                                ? {
                                      path: item.path,
                                  }
                                : ''
                        "
                        :class="{
                            'has-path': !!item.path,
                        }"
                    >
                        <a v-if="item.isLink" :href="item.path" class="item" target="_blank">
                            {{ item.title }}
                        </a>
                        <span v-else class="item">
                            {{ item.title }}
                        </span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="right">
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
            <!-- <div
            class="bt">
            <SvgIcon
                :style="'width:25px;height:25px;'"
                name="commentlines-fill.svg"></SvgIcon>
        </div> -->
            <div @click="toggleFullScreen" class="bt">
                <SvgIcon :style="'width:25px;height:25px;'" name="svg:Navbar-full.svg"></SvgIcon>
            </div>
            <el-dropdown
                trigger="click"
                :popper-options="{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 0],
                            },
                        },
                    ],
                }"
            >
                <div class="user-container">
                    <el-image class="img" :src="dataContainer.userInfo.avatar" fit="cover" />
                    <div class="name">
                        {{ dataContainer.userInfo.nickName }}
                        <div class="other">
                            {{ dataContainer.userInfo.userName }}
                        </div>
                    </div>
                    <div class="option">
                        <SvgIcon
                            :style="'width:15px;height:15px;'"
                            name="svg:sort-down.svg"
                        ></SvgIcon>
                    </div>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            <div class="item">
                                <router-link to="/main/mine/info">
                                    <SvgIcon
                                        :style="'width:16px;height:16px;'"
                                        name="svg:user-fill.svg"
                                    ></SvgIcon>
                                    个人中心，修改头像
                                </router-link>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="item">
                                <router-link to="/main/mine/info-password">
                                    <SvgIcon
                                        :style="'width:16px;height:16px;'"
                                        name="svg:supervise.svg"
                                    ></SvgIcon>
                                    密码修改
                                </router-link>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="item logout-bt" @click.stop="onLogout">
                                <SvgIcon
                                    :style="'width:16px;height:16px;color:#f56c6c;margin-right:10px;'"
                                    name="svg:poweroff.svg"
                                ></SvgIcon>
                                退出登录
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="search-container">
            <div @click="addNewPage" class="container">
                <div class="left">
                    <SvgIcon
                        :style="'width:17px;height:17px;margin-right:10px;'"
                        name="svg:search-bt.svg"
                    ></SvgIcon>
                    搜索目录
                </div>
                <div class="right">Alt S</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.navbar-cp-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--text-color-1);
    position: relative;
    --item-gap: 15px;
    @media (max-width: 1100px) {
        > .left {
            > .path-list-container {
                display: none !important;
            }
        }
    }
    @media (max-width: 750px) {
        > .left {
            > .path-list-container {
                display: none !important;
            }
        }
        > .search-container {
            display: none !important;
        }
    }
    > .left {
        flex: 1 1 0;
        width: 0;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        > .hidden-bt {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            margin-left: var(--item-gap);
            > * {
                cursor: pointer;
                transition: all 0.2s;
                &:hover {
                    color: var(--text-color);
                }
            }
        }
        > .path-list-container {
            flex: 1 1 0;
            width: 0;
            padding: 0 var(--item-gap);
            box-sizing: border-box;
            mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 50px), transparent);
            :deep(.el-breadcrumb) {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: nowrap;
                width: max-content;
                .el-breadcrumb__separator {
                    display: none;
                }
                .el-breadcrumb__item {
                    background-color: #000000;
                    padding: 7px 15px;
                    font-size: 12px;
                    display: block;
                    --el-text-color-regular: var(--text-color);
                    clip-path: polygon(
                        0 0,
                        calc(100% - 8px) 0,
                        100% 50%,
                        calc(100% - 8px) 100%,
                        0 100%,
                        8px 50%
                    );
                    &:first-child {
                        clip-path: polygon(
                            0 0,
                            calc(100% - 8px) 0,
                            100% 50%,
                            calc(100% - 8px) 100%,
                            0 100%
                        ) !important;
                        border-radius: 5px 0px 0 5px !important;
                    }
                    &:last-child {
                        background-color: #505050 !important;
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%);
                        border-radius: 0 5px 5px 0;
                    }
                    &.has-path {
                        background-color: #505050;
                    }
                }
            }
        }
    }
    > .right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding: 0px var(--item-gap) 0 0;
        box-sizing: border-box;
        position: relative;
        height: 100%;
        > * {
            margin-left: var(--item-gap);
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
        :deep(.el-dropdown) {
            width: auto;
            height: 100%;
            .user-container {
                width: auto;
                height: 100%;
                cursor: pointer;
                border-radius: 0 0 0 0;
                transition: all 0.2s;
                position: relative;
                border: none;
                box-shadow: none;
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                > .img {
                    width: 37px;
                    min-width: 37px;
                    height: 37px;
                    border-radius: 50%;
                    margin-right: 5px;
                    // border: 2px solid #949494;
                    box-shadow: #0000002a 2px 2px 5px;
                }
                > .name {
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 5px;
                    display: flex;
                    flex-direction: column;
                    > .other {
                        font-size: 12px;
                        opacity: 0.6;
                        margin-top: 2px;
                        font-weight: 400;
                    }
                }
                > .option {
                    width: fit-content;
                    height: fit-content;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
    > .search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        > .container {
            width: max(300px, 25vw);
            height: 35px;
            background-color: rgba(0, 0, 0, 0.371);
            transition: all 0.2s;
            pointer-events: initial;
            border-radius: 8px;
            padding: 0 10px;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            color: #a3a3a3;
            > .left {
                height: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: 15px;
            }
            > .right {
                border: 1px solid #777777;
                padding: 3px 5px;
                font-size: 12px;
                border-radius: 5px;
                font-weight: bold;
            }
        }
    }
}
</style>
