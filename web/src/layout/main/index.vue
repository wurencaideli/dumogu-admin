<script>
/** 
 * 操作 layout
 * 负责相应事件的统一分发处理
 */
import { 
    ref, defineComponent,h,
    reactive,watch,
    toRef,
    computed,
    onMounted,
    onUnmounted,
} from 'vue';
import Navbar from "./components/Navbar.vue";
import Menu from "./components/Menu.vue";
import TagList from "./components/TagList.vue";
import { useRouter,useRoute } from "vue-router";
import {userData} from "@/store/User";
import {publicData} from "@/store/Public";
import {sysMeluList} from "@/router/Common";
import img_1 from "@/assets/logo.png";
import {
    deleteCurrentTag,
    refreshCurrentTag,
    deleteOtherTags,
    deleteLeftTags,
    deleteRightTags,
    getLatelyHisTag,
    updateTag,
    refreshTag,
    deleteTags,
    formatTagsByMenu,
    getTag,
    refreshAllTag,
} from "./Common/TagListTools";
import {deepCopyObj} from "@/common/OtherTools";
import {toggleFullScreen} from "@/common/OtherTools";
import {guid} from "@/common/Guid";

export default defineComponent({
    name:'MainLayout',
    components: {
        Menu,
        Navbar,
        TagList,
    },
    props: {},
    setup() {
        let userDataStore = userData();
        let publicDataStore = publicData();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            img:{
                img_1,
            },
            userInfo:toRef(userDataStore,'userInfo'),
            tagList:toRef(userDataStore,'tagList'),
            activeSign:toRef(userDataStore,'activeSign'),
            showMenuList:toRef(userDataStore,'showMenuList'),
            hasSysMenuConfigMap:toRef(userDataStore,'hasSysMenuConfigMap'),
            tagHisList:toRef(userDataStore,'tagHisList'),
            iframeList:toRef(publicDataStore,'iframeList'),  //当前已打开的iframe数组
            showMenu:toRef(publicDataStore,'showMenu'),  //是否显示目录
            breadcrumbList:[],  //面包屑列表
            optionBtShow:true,  //控制按钮的显示
        });
        const otherDataContainer = {
            baseCountdown:3,
            countdown:0,  //控制按钮显示的倒计时
            timer:null,
        };
        /** 
         * iframe list map
         * 记录已有的iframe个数的path map 方便查找
         *  */
        const iframePathMap = computed(()=>{
            return dataContainer.iframeList.reduce((c,i)=>{
                c[i.path] = i;
                return c;
            },{});
        });
        /** 
         * 需要缓存的页面列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheTagList = computed(()=>{
            return userDataStore.tagList.filter(item=>{
                return item.isCache;
            }).map(item=>{
                /** 缓存组件是根据path命名来缓存的 */
                return item.path;
            });
        });
        /** 当前活动的标签 */
        const activeTag = computed(()=>{
            let tag = dataContainer.tagList.find(item=>item.sign == dataContainer.activeSign);
            return tag || {};
        });
        /** 
         * 原本方法根据组件名来缓存，现在根据路由path动态修改组件实例名称来缓存
         * 添加tag时也根据路由path来命名
         * 该实例其实也是组件对象（并没有解决问题）
         * 解决方法文章 https://blog.csdn.net/qq_42611074/article/details/127206469
         */
        const wrapperMap = new Map();
        function formatComponentInstance(component,route){
            let wrapper;
            // 重点就是这里，这个组件的名字是完全可控的，
            // 只要自己写好逻辑，每次能找到对应的外壳组件就行，完全可以写成任何自己想要的名字
            // 这就能配合 keep-alive 的 include 属性可控地操作缓存
            if (!component) return;
            /** 根据路由的path来为组件命名 */
            const wrapperName = route.path;
            if (wrapperMap.has(wrapperName)) {
                wrapper = wrapperMap.get(wrapperName);
            } else {
                wrapper = {
                    name: wrapperName,
                    render() {
                        return h(component);
                    },
                };
                wrapperMap.set(wrapperName, wrapper);
            }
            /** 以标签页为主，清除不需要的，减少内存 */
            let pathList = userDataStore.tagList.map(item=>item.path);
            wrapperMap.forEach((_,key)=>{
                if(pathList.includes(key)) return;
                wrapperMap.delete(key);
            });
            return h(wrapper);
        }
        /** 页面加载后重新映射标签页与菜单的关系 */
        onMounted(()=>{
            formatTagsByMenu();
        });
        /** 根据系统目录获取用户的目录配置 */
        function getUserMenu(data){
            /** 优先使用当前的path判断获取映射 */
            let target = dataContainer.hasSysMenuConfigMap[data.path] || dataContainer.hasSysMenuConfigMap[data.name];
            return target;
        }
        /** 
         * 获取面包屑列表
         * 根据当前用户目录中获取树形级别
         *  */
        function getBreadcrumbList(){
            const userMenuConfig = getUserMenu(route);
            if(!userMenuConfig) return;
            if(!userMenuConfig.path) return;
            let list = [];
            function findP(target){
                list.unshift(target);
                let targetP = dataContainer.hasSysMenuConfigMap[target.parentSign];
                if(targetP){
                    findP(targetP);
                }
            }
            findP(userMenuConfig);
            dataContainer.breadcrumbList = list;
        }
        /** 添加历史点击记录 */
        function addHisTagList(){
            let tagHisList = dataContainer.tagHisList;
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            /** 如果与最近的一个重复则不添加 */
            let latelyHisTag = getLatelyHisTag();
            if(latelyHisTag && (latelyHisTag.sign == activeSign)) return;
            /** 找到当前显示的tag，并且添加记录 */
            let activeTag = tagList.find(item=>item.sign==activeSign);
            if(!activeTag) return;
            /** 添加到数据管理 */
            tagHisList.push(activeTag);
            userDataStore.setTagHisList(tagHisList);
        }
        /**
         * 根据当前路由情况 添加标签
         */
        function addTag(){
            let tagList = deepCopyObj(dataContainer.tagList);
            let activeSign = dataContainer.activeSign;
            /** 获取该路由对应的用户配置 */
            const userMenuConfig = getUserMenu(route);
            /** 如果没有该路由配置表示不允许添加标签页 */
            if(!userMenuConfig) return;
            /** 
             * 创建一个新标签，配置其属性
             * 其中sign是唯一标识，很重要，必填 
             * menuName 必填
             * */
            let newTag = {
                title:userMenuConfig.title,
                menuName:userMenuConfig.name,
                path:route.path,
                fullPath:route.fullPath,
                sign:guid(),  //唯一标识
                isCache:userMenuConfig.isCache,  //表示该标签需要缓存
                fixed:userMenuConfig.fixed,  //表示该标签需要固定
                showTagIcon:userMenuConfig.showTagIcon,  //表示该标签是否需要显示icon
                iconName:userMenuConfig.iconName,  //表示该标签对应的icon
                viewFullScreen:userMenuConfig.viewFullScreen,  //表示该标签视图全屏
                hiddenViewFullScreenBt:userMenuConfig.hiddenViewFullScreenBt,  //表示该标签视图全屏时隐藏全屏按钮
                redirectPath:{  //刷新重定向路由地址参数
                    name:'main-redirect',
                    params:{
                        path:route.fullPath,
                    },
                },
            };
            /** 
             * 必须是系统目录中的，不然不允许添加标签，因为只有属于目录才会有标签
             *  */
            if(!sysMeluList.find(item=>item.name == route.name)) return;
            /** 
             * 不重复添加
             * 相同path的判断为重复
             *  */
            let target = tagList.find(item=>item.path == newTag.path);
            if(!target){
                // 添加进入标签列表，添加到当前标签的右边
                let index = tagList.findIndex(item=>{
                    return item.sign == activeSign;
                });
                if(index != -1){
                    tagList.splice(index+1,0,newTag);
                }else{
                    tagList.push(newTag);
                }
                /** 设置当前所显示的标签 */
                activeSign = newTag.sign;
            }else{
                activeSign = target.sign;
                /** 防止没有刷新地址 */
                target.redirectPath = target.redirectPath || newTag.redirectPath;
            }
            userDataStore.setTagList(tagList);
            userDataStore.setActiveSign(activeSign);
            /** 添加历史记录 */
            addHisTagList();
        }
        /** 监听路由，
         * 当路由发生变化时将符合条件的标签添加到标签列表中 
         * 获取面包屑导航列表
         * */
        watch(route,()=>{
            addTag();
            getBreadcrumbList();
        },{
            immediate:true,
        });
        /** 
         * tag 点击事件
         * 跳转到该标签的地址里，注意是完整地址
         *  */
        function handleTagClick(item){
            if(!item || !item.fullPath) return;
            router.push(item.fullPath);
        }
        /** 
         * tag 删除事件
         * 删除后跳转到一个最近的标签，使用标签记录
         *  */
        function handleTagRemove(tag){
            let tagList = dataContainer.tagList;
            let activeSign = dataContainer.activeSign;
            /** 还剩最后一个标签的话不用删除 */
            if(tagList.length <= 1) return;
            let lastTarget = null;
            let nextTarget = null;
            let target = tagList.find((item,index)=>{
                let state = item.sign == tag.sign;
                if(state){
                    lastTarget = tagList[index - 1];
                    nextTarget = tagList[index + 1];
                }
                return state;
            });
            if(!target) return;
            /** 删除此标签页 */
            deleteTags(target.sign);
            /** 如果删除的是当前的标签页的话跳转到最近的标签 */
            if(target.sign === activeSign){
                let latelyHisTag = getLatelyHisTag();
                /** 没有的话跳转到上一个或者下一个 */
                latelyHisTag = latelyHisTag || lastTarget || nextTarget;
                /** 触发该标签的点击事件 */
                handleTagClick(latelyHisTag);
            }
        }
        /** 操作事件 */
        function handleOptionClick(type,tagParams){
            tagParams = tagParams || {};
            let tag;
            switch(true){
                case type == 1:
                    deleteCurrentTag();
                    let latelyHisTag = getLatelyHisTag();
                    /** 触发该标签的点击事件 */
                    handleTagClick(latelyHisTag);
                    break;
                case type == 2:
                    deleteOtherTags();
                    break;
                case type == 3:
                    deleteLeftTags();
                    break;
                case type == 4:
                    deleteRightTags();
                    break;
                case type == 5:
                    refreshCurrentTag();
                    break;
                case type == 6:
                    tag = getTag(dataContainer.activeSign);
                    if(tag){
                        updateTag({
                            ...tag,
                            viewFullScreen:true,
                        });
                    }
                    break;
                case type == 7:
                    tag = getTag(tagParams.sign);
                    if(tag){
                        updateTag({
                            ...tag,
                            viewFullScreen:true,
                        });
                        /** 触发该标签的点击事件 */
                        handleTagClick(tag);
                    }
                    break;
                case type == 8:
                    refreshAllTag();
                    break;
            }
        }
        /** 切换缓存状态 */
        function handleSwitchCache(item){
            if(!item) return;
            updateTag({
                ...item,
                isCache:!item.isCache,
            });
        }
        /** 切换固定状态 */
        function handleSwitchFixed(item){
            if(!item) return;
            updateTag({
                ...item,
                fixed:!item.fixed,
            });
        }
        /** 刷新指定标签页 */
        function handleRefresh(item){
            if(!item) return;
            refreshTag(item.sign);
        }
        /** 取消内容全屏 */
        function handleClick_1(){
            let item = getTag(dataContainer.activeSign);
            if(item){
                updateTag({
                    ...item,
                    viewFullScreen:false,
                });
            };
        }
        /** 按钮消失的倒计时 */
        otherDataContainer.timer = setInterval(()=>{
            otherDataContainer.countdown = otherDataContainer.countdown - 1;
            if(otherDataContainer.countdown <= 0){
                dataContainer.optionBtShow = false;
            }
        },1000);
        /** 设置显示的事件回调 */
        function setupShow(){
            otherDataContainer.countdown = otherDataContainer.baseCountdown;
            dataContainer.optionBtShow = true;
        }
        function setupShow_1(event){
            // 检查按下的键是否是ESC键
            if (event.key === 'Escape' || event.key === 'Esc') {
                otherDataContainer.countdown = otherDataContainer.baseCountdown;
                dataContainer.optionBtShow = false;
                let item = getTag(dataContainer.activeSign);
                if(item){
                    updateTag({
                        ...item,
                        viewFullScreen:false,
                    });
                };
            }
        }
        /** 鼠标移动的时候显示 */
        window.addEventListener('mousemove',setupShow);
        /** Esc键按下时退出 */
        window.addEventListener('keydown',setupShow_1);
        onUnmounted(()=>{
            clearInterval(otherDataContainer.timer);
            window.removeEventListener('mousemove',setupShow);
            window.removeEventListener('keydown',setupShow_1);
        });
        /** 切换目录展示 */
        function switchShowMenu(state){
            publicDataStore.setShowMenu(state);
        }
        /** 添加一个标签 */
        function handleAdd(){
            let tagList = deepCopyObj(dataContainer.tagList);
            let path = `/main/new-tag-page/${new Date().getTime()}`;
            /** 获取用户配置信息 */
            const userMenuConfig = getUserMenu({
                name:'new-tag-page',
            });
            if(!userMenuConfig) return;
            let newTag = {
                title:userMenuConfig.title,
                menuName:userMenuConfig.name,
                path:path,
                fullPath:path,
                sign:guid(),  //唯一标识
                isCache:userMenuConfig.isCache,  //表示该标签需要缓存
                fixed:userMenuConfig.fixed,  //表示该标签需要固定
                showTagIcon:userMenuConfig.showTagIcon,  //表示该标签是否需要显示icon
                iconName:userMenuConfig.iconName,  //表示该标签对应的icon
                viewFullScreen:userMenuConfig.viewFullScreen,  //表示该标签视图全屏
                hiddenViewFullScreenBt:userMenuConfig.hiddenViewFullScreenBt,  //表示该标签视图全屏时隐藏全屏按钮
                redirectPath:{  //刷新重定向路由地址参数
                    name:'main-redirect',
                    params:{
                        path:path,
                    },
                },
            };
            tagList.push(newTag);
            userDataStore.setTagList(tagList);
            /** 模拟点击 */
            handleTagClick(newTag);
        }
        /** 是否显示添加标签按钮 */
        const showTagAdd = computed(()=>{
            return !!dataContainer.hasSysMenuConfigMap['new-tag-page'];
        });
        return {
            formatComponentInstance,
            dataContainer,
            handleTagClick,
            handleTagRemove,
            cacheTagList,
            handleOptionClick,
            userDataStore,
            handleSwitchCache,
            handleSwitchFixed,
            handleRefresh,
            iframePathMap,
            routeIncetance:route,
            toggleFullScreen,
            handleClick_1,
            switchShowMenu,
            handleAdd,
            showTagAdd,
            activeTag,
        };
    },
});
</script>

<template>
    <div 
        :class="{
            'main-layout':true,
            'is-view-full-screen':!!activeTag.viewFullScreen,
        }">  
        <div class="head-container">
            <div
                :class="{
                    'left':true,
                    'hidden':!dataContainer.showMenu,
                }">
                <el-image 
                    @click="toPath({path:'/'})"
                    class="logo"
                    :src="dataContainer.img.img_1" fit="cover" />
                <div class="name">
                    毒蘑菇 - 管理
                </div>
            </div>
            <div class="right">
                <Navbar
                    :showLogo="dataContainer.showMenu"
                    @switchShowLogo="()=>{
                        switchShowMenu(!dataContainer.showMenu);
                    }"
                    :userInfo="dataContainer.userInfo"
                    :breadcrumbList="dataContainer.breadcrumbList"></Navbar>
            </div>
        </div>
        <div class="content-container">
            <div
                :class="{
                    'left':true,
                    'hidden':!dataContainer.showMenu,
                }"
                class="left">
                <Menu
                    :dataList="dataContainer.showMenuList"></Menu>
            </div>
            <div class="right">
                <div class="top">
                    <TagList
                        :tagList="dataContainer.tagList"
                        :activeSign="dataContainer.activeSign"
                        @onChange="e=>{
                            userDataStore.setTagList(e);
                        }"
                        @onClick="handleTagClick"
                        @onRemove="handleTagRemove"
                        @onSwitchCache="handleSwitchCache"
                        @onSwitchFixed="handleSwitchFixed"
                        @onRefresh="handleRefresh"
                        @onAdd="handleAdd"
                        :showTagAdd="showTagAdd"
                        @onOptionClick="handleOptionClick"></TagList>
                </div>
                <div class="view-container">
                    <router-view 
                        v-slot="{ Component,route }">
                        <transition name="el-fade-in">
                            <keep-alive 
                                :include="cacheTagList">
                                <component 
                                    :is="formatComponentInstance(Component,route)"/>
                            </keep-alive>
                        </transition>
                    </router-view>
                    <!-- 当前打开的iframe列表页，防止重新刷新 -->
                    <div
                        :style="{
                            'z-index':iframePathMap[routeIncetance.path]?1:-1,
                            'opacity':iframePathMap[routeIncetance.path]?1:0,
                        }"
                        class="iframe-view">
                        <iframe 
                            v-for="item in dataContainer.iframeList"
                            :key="item.key"
                            :style="{
                                'z-index':item.path==routeIncetance.path?1:-1,
                                'opacity':item.path==routeIncetance.path?1:0,
                            }"
                            :src="item.src"
                            width="100%" height="100%" frameborder="0"
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div 
                        v-if="!!activeTag.viewFullScreen && !activeTag.hiddenViewFullScreenBt"
                        :class="{
                            'option-bt-list':true,
                            'show':dataContainer.optionBtShow,
                        }">
                        <div class="container">
                            <SvgIcon
                                :style="'width:16px;height:16px;'"
                                @click="handleClick_1"
                                name="compress-alt"></SvgIcon>
                            <SvgIcon
                                :style="'width:16px;height:16px;'"
                                @click="toggleFullScreen"
                                name="Navbar-full"></SvgIcon>
                        </div>
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
    /** 内容页面全屏展示 */
    &.is-view-full-screen{
        >.head-container{
            z-index: 1;
            display: none;
        }
        >.content-container{
            z-index: 2;
            position: initial;
            >.left{
                z-index: 2;
                display: none;
            }
            >.right{
                z-index: 3;
                position: initial;
                >.top{
                    display: none;
                }
                >.view-container{
                    z-index: 4;
                    position:absolute;
                    top: 0;
                    left: 0;
                    flex: initial;
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
    >.head-container{
        width: 100%;
        background-color: white;
        height: var(--navbar-height);
        // border-bottom: 1px solid rgb(218, 218, 218);
        box-sizing: border-box;
        position: relative;
        z-index: 9;
        display: flex;
        flex-direction: row;
        >.left{
            width: var(--menu-width);
            height: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            background-color: #153451e8;
            // color:#444954;
            color: #f0f0f0;
            transition: all 0.2s;
            overflow: hidden;
            border-bottom: 1px solid rgba(0, 0, 0, 0.238);
            &.hidden{
                width: 0;
                padding: 0;
                // display: none;
                pointer-events: none;
                >.name{
                    font-size: 0;
                }
            }
            >.logo{
                // flex:1 1 0;
                width: 45px;
                height: 45px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
            }
            >.name{
                width: max-content;
                font-size: 22px;
                font-weight: bold;
                transition: all 0.2s;
                font-family: cursive;
            }
        }
        >.right{
            flex: 1 1 0;
            width: 0;
            height: 100%;
            border-bottom: 1px solid var(--border-color);
            box-sizing: border-box;
        }
    }
    >.content-container{
        flex: 1 1 0;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        position: relative;
        z-index: 8;
        >.left{
            width: var(--menu-width);
            height: 100%;
            overflow-y: auto;
            // border-right: 1px solid rgb(218, 218, 218);
            box-sizing: border-box;
            position: relative;
            z-index: 9;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
            background-color: #153451e8;
            transition: width 0.2s;
            overflow: hidden;
            &.hidden{
                width: 0;
                // display: none;
                pointer-events: none;
            }
        }
        >.right{
            flex: 1 1 0;
            width: 0;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 8;
            overflow: hidden;
            >.top{
                height: var(--tags-height);
                width: 100%;
                // border-bottom: 1px solid rgb(218, 218, 218);
                box-sizing: border-box;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.177);
                position: relative;
                z-index: 2;
            }
            >.view-container{
                flex: 1 1 0;
                height: 0;
                width: 100%;
                overflow: hidden;
                position: relative;
                z-index: 1;
                background-color: #f1f1f1;
                >.iframe-view{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    >iframe{
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                    }
                }
                >.option-bt-list{
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
                    &.show{
                        opacity: 1;
                        pointer-events: initial;
                    }
                    >.container{
                        width: auto;
                        border-radius: 3px;
                        background-color: rgb(255, 255, 255);
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 5px;
                        box-sizing: border-box;
                        box-shadow: rgba(0, 0, 0, 0.476) 0px 1px 3px;
                        >*{
                            margin-right: 5px;
                            cursor: pointer;
                            border-radius: 3px;
                            box-shadow: inset 0 1px 4px #0000001f;
                            padding: 7px;
                            color:#444954;
                            &:last-child{
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
