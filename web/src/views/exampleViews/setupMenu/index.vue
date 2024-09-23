<template>
    <DefinScrollbar height="100%" :showUpBt="true">
        <div class="page-container main-view">
            <div class="container">
                <p>当前加载时间：{{ dataContainer.nowTime }}</p>
                <p>当前加载时间戳：{{ dataContainer.nowTime_1 }}</p>
                <h3>用户总目录可展示信息，方便左侧展示，树形结构，过滤了隐藏的目录</h3>
                <p>
                    {{ userMenu_1 }}
                </p>
                <h3>系统目录信息，系统包含的页面，用name与用户目录相关联</h3>
                <p>
                    {{ sysMenu }}
                </p>
            </div>
        </div>
    </DefinScrollbar>
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
    computed,
    onDeactivated,
} from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import { Delete } from '@element-plus/icons-vue';
import { userDataStore } from '@/store/user';
import { sysMeluConfigList } from '@/router/common';
import { onBeforeRouteLeave } from 'vue-router';
import DefinScrollbar from '@/components/definScrollbar.vue';

export default defineComponent({
    components: {
        SvgIcon,
        Delete,
        DefinScrollbar,
    },
    setup() {
        let userData = userDataStore();
        const router = useRouter();
        const dataContainer = reactive({
            loading: false,
            nowTime: new Date(),
            nowTime_1: new Date().getTime(),
        });
        const otherDataContainer = {
            top: 0, //记录滚动条
        };
        let userMenu_1 = computed(() => {
            return JSON.stringify(userData.showMenuList, null, 4);
        });
        let sysMenu = computed(() => {
            return JSON.stringify(sysMeluConfigList, null, 4);
        });
        return {
            dataContainer,
            sysMenu,
            userMenu_1,
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
            white-space: pre-wrap;
            &:last-child {
                margin: 0;
            }
        }
    }
}
</style>
