<script>
/**
 * 左侧菜单组件
 */
import { defineComponent, ref, reactive, onMounted, toRef } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { useRouter, useRoute } from 'vue-router';
import MenuItem from './MenuItem.vue';

export default defineComponent({
    name: 'Menu',
    components: {
        SvgIcon,
        MenuItem,
    },
    props: {
        /** 所显示的数据列表 */
        dataList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    setup(props) {
        const route = useRoute();
        const ElMenuRef = ref(null);
        const dataContainer = reactive({
            dataList: toRef(props, 'dataList'),
        });
        /**
         * 当页面加载后设置设置当前打开的父节点，因为如果父节点可点击的话不会自动打开
         * */
        onMounted(() => {
            if (!ElMenuRef.value) return;
            let el = ElMenuRef.value.$el;
            let hasActiveSubEl = el.querySelector('.el-sub-menu .is-sub-defin-active');
            if (!hasActiveSubEl) return;
            ElMenuRef.value.open(route.path);
        });
        return {
            dataContainer,
            route,
            ElMenuRef,
        };
    },
});
</script>

<template>
    <el-menu
        class="menu-container"
        ref="ElMenuRef"
        :collapse="false"
        :default-active="route.fullPath"
        :router="false"
    >
        <MenuItem
            v-for="(item, index) in dataContainer.dataList"
            :key="item.path"
            :dataInfo="item"
        ></MenuItem>
    </el-menu>
</template>

<style scoped lang="scss">
.menu-container {
    width: 100%;
    border: none !important;
    padding: 0 10px 0 10px;
    box-sizing: border-box;
    /** 基础目录配置 */
    --local-active-text-color: #ffffff;
    --local-active-bg-color: #5240ff96;
    --local-active-sub-bg-color: #3634ac57;
    --local-hover-color: #3634ac57;
    --local-font-size: 15px;
    --local-text-color: #a8bacc;
    --local-box-shadow: 0 1px 4px #001247;
    --local-border-radius: 8px;
    --el-menu-active-color: var(--local-active-text-color) !important;
    --el-menu-item-font-size: var(--local-font-size) !important;
    --el-menu-text-color: var(--local-text-color) !important;
    --el-menu-hover-bg-color: var(--local-hover-color) !important;
    --active-item-bg-color: var(--local-active-bg-color) !important;
    --el-menu-bg-color: transparent !important;
    --el-menu-base-level-padding: 15px !important;
    --el-menu-level-padding: 15px !important;
    --el-menu-icon-width: calc(15px + 0) !important;
    --el-menu-item-height: 45px !important;
    --el-menu-sub-item-height: 45px !important;
    --active-sub-bg-color: transparent !important;
    :deep(.menu-item-container) {
        .el-sub-menu__icon-arrow {
            margin-top: 0 !important;
            top: initial !important;
        }
        .el-menu {
            padding: 0;
        }
        .el-sub-menu__title,
        .el-menu-item {
            min-height: var(--el-menu-item-height) !important;
            height: fit-content !important;
            line-height: initial !important;
        }
        .el-sub-menu {
            > .el-sub-menu__title {
                border-radius: var(--local-border-radius);
            }
            &.is-active {
                background-color: var(--active-sub-bg-color);
                > .el-sub-menu__title {
                    background-color: var(--local-active-sub-bg-color);
                }
            }
            .el-sub-menu__icon-arrow {
                right: 10px !important;
                font-size: 20px !important;
            }
            &.is-sub-defin-active {
                > .el-sub-menu__title {
                    background-color: var(--active-item-bg-color);
                    // font-weight: bold;
                    color: var(--el-menu-active-color);
                    box-shadow: var(--local-box-shadow);
                }
            }
            /** 表示有已经活动的sub目录 */
            &:has(.is-sub-defin-active) {
                background-color: var(--active-sub-bg-color);
                > .el-sub-menu__title {
                    background-color: var(--local-active-sub-bg-color);
                }
            }
        }
        .el-menu-item {
            border-radius: var(--local-border-radius);
            &.is-active {
                background-color: var(--active-item-bg-color);
                // font-weight: bold;
                box-shadow: var(--local-box-shadow);
            }
        }
    }
}
</style>
