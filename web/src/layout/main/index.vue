<script>
/**
 * 操作 layout
 * 负责相应事件的统一分发处理
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
} from 'vue';
import Navbar from './components/navbar.vue';
import Menu from './components/menu.vue';
import TagList from './components/tagList.vue';
import { useRouter, useRoute } from 'vue-router';
import { userDataStore } from '@/store/user';
import { publicDataStore } from '@/store/public';
import { sysMeluConfigList } from '@/router/common';
import img_1 from '@/assets/logo.png';
import { deepCopyObj } from '@/common/otherTools';
import { toggleFullScreen } from '@/common/otherTools';
import { getNanoid } from '@/common/guid';
import keepAliveRouter from '@/components/keepAliveRouter.vue';
import searchContainer from './components/searchContainer.vue';

export default defineComponent({
    name: 'MainLayout',
    components: {
        Menu,
        Navbar,
        TagList,
        keepAliveRouter,
        searchContainer,
    },
    props: {},
    setup() {
        let userData = userDataStore();
        let publicData = publicDataStore();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            name: import.meta.env.VITE_APP_name,
            img: {
                img_1,
            },
            layoutName: 'main', // layout分组名
            userInfo: toRef(userData, 'userInfo'),
            tagsMap: toRef(userData, 'tagsMap'), // 根据用户目录生成的页面的标签MAP
            userMenuList: toRef(userData, 'userMenuList'), // 用户自定义的目录信息，用作左侧目录展示
            iframeList: toRef(userData, 'iframeList'), //当前已打开的iframe数组
            userMenuSignMap: toRef(userData, 'userMenuSignMap'),
            showMenu: toRef(publicData, 'showMenu'), //是否显示目录
            breadcrumbList: [], //面包屑列表
        });
        /**
         * iframe list map
         * 记录已有的iframe个数的path map 方便查找
         *  */
        const iframePathMap = computed(() => {
            return dataContainer.iframeList
                .filter((item) => {
                    return item.layoutName == dataContainer.layoutName;
                })
                .reduce((c, i) => {
                    c[i.path] = i;
                    return c;
                }, {});
        });
        /**
         * 需要缓存的页面列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheTagList = computed(() => {
            let tagList = dataContainer.tagsMap[dataContainer.layoutName || ''] || [];
            return tagList
                .filter((item) => {
                    return item.isCache;
                })
                .map((item) => {
                    /** 缓存组件是根据path命名来缓存的 */
                    return item.path;
                });
        });
        function toPath(path) {
            router.push(path);
        }
        /**
         * 获取面包屑列表
         * 根据当前用户目录中获取树形级别
         *  */
        function getBreadcrumbList() {
            let list = [];
            let menuList = Object.values(dataContainer.userMenuSignMap);
            let target = menuList.find((item) => {
                if (item.hidden) return false;
                return item.path == route.path;
            });
            function findP(target) {
                if (!target) return;
                list.unshift(target);
                if (!target.parentSign) return;
                let targetP = dataContainer.userMenuSignMap[target.parentSign];
                if (targetP) {
                    findP(targetP);
                }
            }
            findP(target);
            dataContainer.breadcrumbList = list;
        }
        /** 监听路由，
         * 获取面包屑导航列表
         * */
        watch(
            route,
            () => {
                getBreadcrumbList();
            },
            {
                immediate: true,
            },
        );
        /** 切换目录展示 */
        function switchShowMenu(state) {
            publicData.setShowMenu(state);
        }
        return {
            dataContainer,
            routeIncetance: route,
            toPath,
            cacheTagList,
            iframePathMap,
            switchShowMenu,
        };
    },
});
</script>

<template>
    <div class="main-layout">
        <div class="head-container">
            <div
                :class="{
                    left: true,
                    hidden: !dataContainer.showMenu,
                }"
            >
                <el-image
                    @click="toPath({ path: '/' })"
                    class="logo"
                    :src="dataContainer.img.img_1"
                    fit="cover"
                />
                <div class="name">毒蘑菇 - 管理</div>
            </div>
            <div class="right">
                <Navbar
                    :showLogo="dataContainer.showMenu"
                    @switchShowLogo="
                        () => {
                            switchShowMenu(!dataContainer.showMenu);
                        }
                    "
                    :userInfo="dataContainer.userInfo"
                    :breadcrumbList="dataContainer.breadcrumbList"
                ></Navbar>
            </div>
        </div>
        <div class="content-container">
            <div
                :class="{
                    left: true,
                    hidden: !dataContainer.showMenu,
                }"
            >
                <DefinScrollbar :loading="dataContainer.loading" height="100%" :showUpBt="false">
                    <div class="content-left-container">
                        <div class="search-container">
                            <searchContainer></searchContainer>
                        </div>
                        <Menu :dataList="dataContainer.userMenuList"></Menu>
                    </div>
                </DefinScrollbar>
            </div>
            <div class="right">
                <div class="top">
                    <TagList
                        :activePath="routeIncetance.path"
                        :layoutName="dataContainer.layoutName"
                    ></TagList>
                </div>
                <div class="view-container">
                    <keepAliveRouter :cacheList="cacheTagList"></keepAliveRouter>
                    <!-- 当前打开的iframe列表页，防止重新刷新 -->
                    <div
                        :style="{
                            'z-index': iframePathMap[routeIncetance.path] ? 1 : -1,
                            opacity: iframePathMap[routeIncetance.path] ? 1 : 0,
                        }"
                        class="iframe-view"
                    >
                        <iframe
                            v-for="item in dataContainer.iframeList.filter((item) => {
                                return item.layoutName == dataContainer.layoutName;
                            })"
                            :key="item.key"
                            :style="{
                                'z-index': item.path == routeIncetance.path ? 1 : -1,
                                opacity: item.path == routeIncetance.path ? 1 : 0,
                            }"
                            :src="item.src"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            allowfullscreen
                        >
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-layout {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    background-color: white;
    position: relative;
    z-index: 9;
    > .head-container {
        width: 100%;
        background-color: white;
        height: var(--navbar-height);
        box-sizing: border-box;
        position: relative;
        z-index: 9;
        display: flex;
        flex-direction: row;
        > .left {
            width: var(--menu-width);
            height: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            background-color: #153451;
            color: #f0f0f0;
            transition: all 0.2s;
            overflow: hidden;
            border-bottom: 1px solid rgba(0, 0, 0, 0.435);
            &.hidden {
                width: 0;
                padding: 0;
                pointer-events: none;
                > .name {
                    font-size: 0;
                }
            }
            > .logo {
                width: 45px;
                height: 45px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
            }
            > .name {
                width: max-content;
                font-size: 22px;
                font-weight: bold;
                transition: all 0.2s;
                font-family: cursive;
            }
        }
        > .right {
            flex: 1 1 0;
            width: 0;
            height: 100%;
            border-bottom: 1px solid var(--border-color);
            box-sizing: border-box;
        }
    }
    > .content-container {
        flex: 1 1 0;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        position: relative;
        z-index: 8;
        > .left {
            width: var(--menu-width);
            height: 100%;
            overflow-y: auto;
            box-sizing: border-box;
            position: relative;
            z-index: 9;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
            background-color: #153451;
            transition: width 0.2s;
            overflow: hidden;
            :deep(.defin-scrollbar-simplebar) {
                .simplebar-scrollbar:before {
                    background-color: rgb(255, 255, 255);
                }
            }
            &.hidden {
                width: 0;
                pointer-events: none;
            }
            .content-left-container {
                padding: 0 0 10px 0;
                box-sizing: border-box;
                > .search-container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 10px 10px;
                    box-sizing: border-box;
                    :deep(.search-container-cp) {
                        box-shadow: 0 1px 4px #000000;
                        background-color: rgba(0, 0, 0, 0.712);
                    }
                }
            }
            :deep(.el-scrollbar) {
                .el-scrollbar__bar {
                    .el-scrollbar__thumb {
                        background-color: rgba(194, 194, 194, 0.51) !important;
                    }
                }
            }
        }
        > .right {
            flex: 1 1 0;
            width: 0;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 8;
            overflow: hidden;
            > .top {
                height: var(--tags-height);
                width: 100%;
                box-sizing: border-box;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
                position: relative;
                z-index: 2;
            }
            > .view-container {
                flex: 1 1 0;
                height: 0;
                width: 100%;
                overflow: hidden;
                position: relative;
                z-index: 1;
                background-color: #f1f1f1;
                > .iframe-view {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    > iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                    }
                }
            }
        }
    }
}
</style>
