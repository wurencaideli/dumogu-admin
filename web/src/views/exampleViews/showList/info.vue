<template>
    <el-scrollbar height="100%">
        <div class="page-container main-view">
            <div class="container">
                <h3>数据详情页面</h3>
                <p>当前加载时间：{{ dataContainer.nowTime }}</p>
                <p>当前加载时间戳：{{ dataContainer.nowTime_1 }}</p>
                <p>数据唯一标识：{{ dataContainer.form.id }}</p>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
/**
 * 页面例子
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
    onMounted,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import { Delete } from '@element-plus/icons-vue';

export default defineComponent({
    components: {
        SvgIcon,
        Delete,
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading: false,
            form: {},
            nowTime: new Date(),
            nowTime_1: new Date().getTime(),
        });
        /**
         * 数据初始化
         */
        function initData() {
            let params = route.params;
            if (!params.sign) return;
            dataContainer.form = {
                id: params.sign,
            };
        }
        initData();
        return {
            dataContainer,
            initData,
        };
    },
});
</script>

<style lang="scss" scoped>
.main-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    .container {
        background-color: white;
        width: 100%;
        // min-height: 800px;
        height: fit-content;
        border-radius: 5px;
        padding: 30px;
        box-sizing: border-box;
        > * {
            margin: 0 0 30px 0;
            &:last-child {
                margin: 0;
            }
        }
    }
}
</style>
