<script>
/**
 * 操作 layout
 * 负责相应事件的统一分发处理
 */
import { defineComponent, reactive, toRef, computed } from 'vue';
import Navbar from './components/navbar.vue';
import Menu from './components/menu.vue';
import TagList from './components/tagList.vue';
import { useRouter, useRoute } from 'vue-router';
import { userDataStore } from '@/store/user';
import img_1 from '@/assets/logo.png';
import keepAliveRouter from '@/components/keepAliveRouter.vue';
import DefinScrollbar from '@/components/definScrollbar.vue';
import searchContainer from './components/searchContainer.vue';
import { publicDataStore } from '@/store/public';
import { env } from "@/env";

export default defineComponent({
    name: 'MainLayout',
    components: {
        Menu,
        TagList,
        keepAliveRouter,
        Navbar,
        DefinScrollbar,
        searchContainer,
    },
    props: {},
    setup() {
        let publicData = publicDataStore();
        let userData = userDataStore();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            name: env.APP_name,
            fullScreen: toRef(publicData, 'fullScreen'),
            img: {
                img_1,
            },
            layoutName: 'main', // layout分组名
            userInfo: toRef(userData, 'userInfo'),
            tagsMap: toRef(userData, 'tagsMap'), // 根据用户目录生成的页面的标签MAP
            userMenuList: toRef(userData, 'userMenuList'), // 用户自定义的目录信息，用作左侧目录展示
            iframeList: toRef(userData, 'iframeList'), //当前已打开的iframe数组
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
        return {
            dataContainer,
            routeIncetance: route,
            toPath,
            cacheTagList,
            iframePathMap,
        };
    },
});
</script>

<template>
    <div
        :class="{
            'main-layout': true,
            'full-screen': dataContainer.fullScreen,
        }"
    >
        <div class="left">
            <Navbar></Navbar>
        </div>
        <div class="centre">
            <div class="logo" @click="toPath({ path: '/' })">
                <el-image class="img" :src="dataContainer.img.img_1" fit="cover" />
                <div class="name">{{ dataContainer.name }}</div>
            </div>
            <div class="main-centre-content">
                <DefinScrollbar :loading="dataContainer.loading" height="100%" :showUpBt="false">
                    <div class="main-centre-content-container">
                        <div class="search-container">
                            <searchContainer></searchContainer>
                        </div>
                        <Menu :dataList="dataContainer.userMenuList"></Menu>
                    </div>
                </DefinScrollbar>
            </div>
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
</template>

<style scoped lang="scss">
.main-layout {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 9;
    &.full-screen {
        > .left,
        > .centre {
            width: 0;
            opacity: 0;
            pointer-events: none;
        }
    }
    > .left {
        height: 100%;
        background-color: var(--bg-color);
        transition: width 0.2s, opacity 0.2s;
        width: 70px;
    }
    > .centre {
        height: 100%;
        width: var(--menu-width);
        background-color: var(--bg-color-2);
        display: flex;
        flex-direction: column;
        transition: width 0.2s, opacity 0.2s;
        > .logo {
            height: var(--navbar-height);
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            // color:#444954;
            color: #f0f0f0;
            transition: all 0.2s;
            overflow: hidden;
            box-shadow: var(--box-shadow-2);
            border-bottom: 1px solid rgba(0, 0, 0, 0.47);
            cursor: pointer;
            &.hidden {
                width: 0;
                padding: 0;
                // display: none;
                pointer-events: none;
                > .name {
                    font-size: 0;
                }
            }
            > .img {
                // flex:1 1 0;
                width: 45px;
                height: 45px;
                border-radius: 5px;
                margin-right: 10px;
            }
            > .name {
                width: max-content;
                font-size: 22px;
                font-weight: bold;
                transition: all 0.2s;
            }
        }
        > .main-centre-content {
            height: 0;
            flex: 1 1 0;
            .main-centre-content-container {
                > .search-container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 10px 10px;
                    box-sizing: border-box;
                }
            }
        }
    }
    > .right {
        height: 100%;
        background-color: var(--bg-color-3);
        background-image: linear-gradient(to right, var(--bg-color-3) 0%, var(--bg-color-2) 100%);
        flex: 1 1 0;
        width: 0;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 8;
        overflow: hidden;
        > .top {
            height: var(--navbar-height);
            width: 100%;
            // border-bottom: 1px solid rgb(218, 218, 218);
            box-sizing: border-box;
            box-shadow: 0 0 5px #242425;
            position: relative;
            z-index: 2;
            box-shadow: var(--box-shadow-2);
            border-bottom: 1px solid rgba(0, 0, 0, 0.47);
        }
        > .view-container {
            flex: 1 1 0;
            height: 0;
            width: 100%;
            overflow: hidden;
            position: relative;
            z-index: 1;
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
            > .option-bt-list {
                position: absolute;
                top: 5px;
                left: 0;
                width: 100%;
                opacity: 0;
                pointer-events: none;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.2s;
                z-index: 999;
                &.show {
                    opacity: 1;
                    pointer-events: initial;
                }
                > .container {
                    width: auto;
                    border-radius: 3px;
                    background-color: rgb(255, 255, 255);
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 5px;
                    box-sizing: border-box;
                    box-shadow: rgba(0, 0, 0, 0.476) 0px 1px 3px;
                    > * {
                        margin-right: 5px;
                        cursor: pointer;
                        border-radius: 3px;
                        box-shadow: inset 0 1px 4px #0000001f;
                        padding: 7px;
                        color: #444954;
                        &:last-child {
                            margin: 0;
                        }
                    }
                }
            }
        }
    }
    > .head-container {
        width: 100%;
        height: var(--navbar-height);
        // border-bottom: 1px solid rgb(218, 218, 218);
        box-sizing: border-box;
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: row;
        box-shadow: var(--box-shadow-2);
        > .left {
            width: var(--menu-width);
            height: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            background-color: var(--bg-color-2);
            // color:#444954;
            color: #f0f0f0;
            transition: all 0.2s;
            overflow: hidden;
            &.hidden {
                width: 0;
                padding: 0;
                // display: none;
                pointer-events: none;
                > .name {
                    font-size: 0;
                }
            }
            > .logo {
                // flex:1 1 0;
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
            }
        }
        > .right {
            flex: 1 1 0;
            width: 0;
            height: 100%;
            box-sizing: border-box;
            background-color: var(--bg-color-3);
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
            // border-right: 1px solid rgb(218, 218, 218);
            box-sizing: border-box;
            position: relative;
            z-index: 9;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
            background-color: var(--bg-color-2);
            transition: width 0.2s;
            overflow: hidden;
            &.hidden {
                width: 0;
                // display: none;
                pointer-events: none;
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
            background-color: var(--bg-color-3);
            > .top {
                height: var(--tags-height);
                width: 100%;
                // border-bottom: 1px solid rgb(218, 218, 218);
                box-sizing: border-box;
                box-shadow: 0 0 5px #242425;
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
                > .option-bt-list {
                    position: absolute;
                    top: 5px;
                    left: 0;
                    width: 100%;
                    opacity: 0;
                    pointer-events: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.2s;
                    z-index: 999;
                    &.show {
                        opacity: 1;
                        pointer-events: initial;
                    }
                    > .container {
                        width: auto;
                        border-radius: 3px;
                        background-color: rgb(255, 255, 255);
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 5px;
                        box-sizing: border-box;
                        box-shadow: rgba(0, 0, 0, 0.476) 0px 1px 3px;
                        > * {
                            margin-right: 5px;
                            cursor: pointer;
                            border-radius: 3px;
                            box-shadow: inset 0 1px 4px #0000001f;
                            padding: 7px;
                            color: #444954;
                            &:last-child {
                                margin: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
