<script>
/**
 * 左侧菜单组件
 */
import { defineComponent, ref, reactive, onMounted, toRef, h, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import linkItem from './link-item.vue';
import { toTree, unfoldTreeList } from '@/common/tree-tools.js';
import { getNanoid } from '@/common/guid.js';
import { deepCopyObj } from '@/common/other-tools.js';

export default defineComponent({
    name: 'Menu',
    components: {},
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
        const router = useRouter();
        const ElMenuRef = ref(null);
        const dataContainer = reactive({
            dataList: toRef(props, 'dataList'),
            menuOptions: [],
        });
        watch(
            [toRef(props, 'dataList')],
            () => {
                /** 将用户目录格式化成组件需要的格式 */
                let menuOptions = [];
                let menuList = deepCopyObj(props.dataList);
                function formatMenu(menuOptionList, list) {
                    if (!list) return;
                    list.forEach((item) => {
                        let item_ = {
                            key: item.path || getNanoid(),
                            label: h(linkItem, { dataInfo: item }),
                            children: [],
                        };
                        menuOptionList.push(item_);
                        formatMenu(item_.children, item.childs);
                        if (item_.children.length == 0) {
                            delete item_.children;
                        }
                    });
                }
                formatMenu(menuOptions, menuList);
                dataContainer.menuOptions = menuOptions;
            },
            {
                immediate: true,
            },
        );
        return {
            dataContainer,
            route,
            ElMenuRef,
        };
    },
});
</script>

<template>
    <div class="menu-container">
        <a-menu
            :selectedKeys="[route.fullPath]"
            :items="dataContainer.menuOptions"
            mode="inline"
            style="width: 100%"
        >
        </a-menu>
    </div>
</template>

<style scoped lang="scss">
.menu-container {
    width: 100%;
    border: none !important;
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
    --selected-bg: rgba(0, 0, 0, 0.774);
    --selected-color: #9a8dff;
    :deep(.ant-menu) {
        padding: 0 !important;
        border: none !important;
        background-color: transparent !important;
        .ant-menu-item,
        .ant-menu-submenu-title {
            height: fit-content !important;
            min-height: 40px;
            margin-left: 0 !important;
            margin-right: 0 !important;
            width: 100% !important;
            &:first-child {
                margin-top: 0 !important;
            }
        }
        .ant-menu-submenu-selected {
            > .ant-menu-submenu-title {
                color: var(--selected-color) !important;
            }
        }
        .ant-menu-item-selected {
            color: var(--selected-color) !important;
            background-color: var(--selected-bg) !important;
            font-weight: bold;
            transition: all 0.2s;
        }
    }
}
</style>
