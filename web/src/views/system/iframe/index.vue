<script>
/**
 * 站内链接
 * 该页面的组件不实现功能，只管理iframe的链接，route同层级位置实现，防止路由切换不管缓存与否都刷新iframe的情况
 */
import { defineComponent, reactive, onUnmounted, toRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getNanoid } from '@/common/guid';
import { deepCopyObj } from '@/common/otherTools';
import { Loading } from '@element-plus/icons-vue';
import { userDataStore } from '@/store/user';
import { findTag } from '@/action/tagListTools';

export default defineComponent({
    components: {
        Loading,
    },
    setup() {
        let userData = userDataStore();
        const route = useRoute();
        const dataContainer = reactive({
            iframe: {}, //当前管理的iframe
            iframeList: toRef(userData, 'iframeList'), //当前已打开的iframe数组
        });
        /**
         * 数据初始化
         */
        function initData() {
            let params = route.params;
            if (!params.sign) return;
            let tag = findTag(route.path) || {};
            let iframeList = deepCopyObj(dataContainer.iframeList);
            dataContainer.iframe = {
                path: route.path,
                src: decodeURIComponent(params.sign),
                key: getNanoid(), //唯一标识，防止刷新时vue重新利用
                layoutName: tag.layoutName,
            };
            iframeList.push(dataContainer.iframe);
            userData.setIframeList(iframeList);
        }
        initData();
        /** 组件销毁时删除该iframe */
        onUnmounted(() => {
            let iframeList = deepCopyObj(userData.iframeList);
            let index = iframeList.findIndex((item) => {
                return item.key == dataContainer.iframe.key;
            });
            if (index == -1) return;
            iframeList.splice(index, 1);
            userData.setIframeList(iframeList);
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="iframe-view">
        <div class="title">Loading ......</div>
    </div>
</template>

<style lang="scss" scoped>
.iframe-view {
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > .title {
        font-size: 17px;
        margin-top: 40px;
        opacity: 0.7;
    }
}
</style>
