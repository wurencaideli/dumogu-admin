<template>
    <div class="iframe-view">
        <iframe 
            :src="dataContainer.src"
            width="100%" height="100%" frameborder="0"
            allowfullscreen sandbox>
        </iframe>
    </div>
</template>

<script>
/**
 * 页面例子
 * 站内链接
 */
import {defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated} from 'vue';
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
    components: {
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            src:'',
        });
        /** 
         * 数据初始化
         */
        function initData(){
            let params = route.params;
            if(!params.sign) return;
            dataContainer.src = params.sign;
        }
        initData();
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
    }
</style>
