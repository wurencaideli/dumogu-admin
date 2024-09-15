<script>
/**
 * 大屏展示 layout
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
import { deepCopyObj } from '@/common/otherTools';
import { useRouter, useRoute } from 'vue-router';
import keepAliveRouter from '@/components/keepAliveRouter.vue';
import { userDataStore } from '@/store/user';

export default defineComponent({
    name: 'ScreenLayout',
    components: {
        keepAliveRouter,
    },
    props: {},
    setup() {
        let userData = userDataStore();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            layoutName: 'big-screen',
            tagList: toRef(userData, 'tagList'),
        });
        /**
         * 需要缓存的页面列表
         * 根据标签列表来的，需要改的话只需要处理标签列表
         *  */
        const cacheTagList = computed(() => {
            return dataContainer.tagList
                .filter((item) => {
                    return item.layoutName == dataContainer.layoutName && item.isCache;
                })
                .map((item) => {
                    /** 缓存组件是根据path命名来缓存的 */
                    return item.path;
                });
        });
        return {
            dataContainer,
            cacheTagList,
        };
    },
});
</script>

<template>
    <div class="big-screen-layout">
        <keepAliveRouter :cacheList="cacheTagList"></keepAliveRouter>
    </div>
</template>

<style scoped lang="scss">
.big-screen-layout {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>
