<template>
    <div class="iframe-view">
        <el-icon 
            :size="60"
            class="is-loading"
            color="#000000"><Loading /></el-icon>
        <div class="title">
            正在加载。。。
        </div>
    </div>
</template>

<script>
/**
 * 页面例子
 * 站内链接
 * 该页面的组件不实现功能，只管理iframe的链接，route同层级位置实现，防止路由切换不管缓存与否都刷新iframe的情况
 */
import {
    defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated,
    onUnmounted,toRef,
} from 'vue';
import { useRouter, useRoute } from "vue-router";
import {guid} from "@/common/Guid";
import {deepCopyObj} from "@/common/OtherTools";
import {Loading} from '@element-plus/icons-vue';
import tagDataStore from "@/layout/main/common/TagData";

export default defineComponent({
    components: {
        Loading,
    },
    setup() {
        const route = useRoute();
        const dataContainer = reactive({
            iframe:{},  //当前管理的iframe
            iframeList:toRef(tagDataStore,'iframeList'),  //当前已打开的iframe数组
        });
        /** 
         * 数据初始化
         */
        function initData(){
            let params = route.params;
            let query = route.query;
            if(!params.sign) return;
            if(!query.src) return;
            let iframeList = deepCopyObj(dataContainer.iframeList);
            dataContainer.iframe = {
                path:route.path,
                src:decodeURIComponent(query.src),
                key:guid(),  //唯一标识，防止刷新时vue重新利用
            };
            iframeList.push(dataContainer.iframe);
            tagDataStore.setIframeList(iframeList);
        }
        initData();
        /** 组件销毁时删除该iframe */
        onUnmounted(()=>{
            let iframeList = deepCopyObj(tagDataStore.iframeList);
            let index = iframeList.findIndex(item=>{
                return item.key == dataContainer.iframe.key;
            });
            if(index == -1) return;
            iframeList.splice(index,1);
            tagDataStore.setIframeList(iframeList);
        });
        return {
            dataContainer,
        };
    },
});
</script>

<style lang="scss" scoped>
    .iframe-view{
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        >.title{
            font-size: 17px;
            margin-top: 40px;
        }
    }
</style>
