<script>
/** 
 * 大屏展示 layout
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
import {userData} from "@/store/User";
import {deepCopyObj} from "@/common/OtherTools";
import { useRouter,useRoute } from "vue-router";
import {sysMeluList} from "@/router/Common";
import tagDataStore from "./common/TagData";
import {guid} from "@/common/Guid";

export default defineComponent({
    name:'ScreenLayout',
    components: {
    },
    props: {},
    setup() {
        const router = useRouter();
        const route = useRoute();
        let userDataStore = userData();
        const dataContainer = reactive({
            tagList:toRef(tagDataStore,'tagList'),
            activeSign:toRef(tagDataStore,'activeSign'),
            hasSysMenuConfigObj:toRef(userDataStore,'hasSysMenuConfigObj'),
        });
        /** 
         * 需要缓存的页面列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheTagList = computed(()=>{
            return dataContainer.tagList.filter(item=>{
                return item.isCache;
            }).map(item=>{
                /** 缓存组件是根据path命名来缓存的 */
                return item.path;
            });
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
            let pathList = dataContainer.tagList.map(item=>item.path);
            wrapperMap.forEach((_,key)=>{
                if(pathList.includes(key)) return;
                wrapperMap.delete(key);
            });
            return h(wrapper);
        }
        /** 根据系统目录获取用户的目录配置 */
        function getUserMenu(data){
            /** 优先使用当前的path判断获取映射 */
            let target = dataContainer.hasSysMenuConfigObj[data.path] || dataContainer.hasSysMenuConfigObj[data.name];
            return target || {};
        }
        /**
         * 根据当前路由情况 添加标签
         */
        function addTag(){
            let tagList = deepCopyObj(dataContainer.tagList);
            let activeSign = dataContainer.activeSign;
            /** 获取该路由对应的用户配置 */
            const userMenuConfig = getUserMenu(route);
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
                redirectPath:{  //刷新重定向路由地址参数
                    name:'big-screen-redirect',
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
            tagDataStore.setTagList(tagList);
            tagDataStore.setActiveSign(activeSign);
        }
        /** 监听路由，
         * 当路由发生变化时将符合条件的标签添加到标签列表中 
         * 获取面包屑导航列表
         * */
        watch(route,()=>{
            addTag();
        },{
            immediate:true,
        });
        return {
            formatComponentInstance,
            dataContainer,
            cacheTagList,
        };
    },
});
</script>

<template>
    <div 
        class="big-screen-layout">    
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
    </div>
</template>

<style scoped lang="scss">
.main-layout {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>
