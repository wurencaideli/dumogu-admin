<script>
/**
 * 左侧菜单组件
 */
import { defineComponent, ref, reactive, onMounted, toRef, h, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import linkItem from './linkItem.vue';
import { toTree, unfoldTreeList } from '@/common/treeTools';
import { getNanoid } from '@/common/guid';
import { deepCopyObj } from '@/common/otherTools';

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
                            label: () => {
                                return h(linkItem, { dataInfo: item });
                            },
                            childs: [],
                        };
                        menuOptionList.push(item_);
                        formatMenu(item_.childs, item.childs);
                        if (item_.childs.length == 0) {
                            delete item_.childs;
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
        <n-menu
            children-field="childs"
            label-field="label"
            key-field="key"
            :value="route.fullPath"
            :root-indent="15"
            :indent="15"
            :options="dataContainer.menuOptions"
        >
        </n-menu>
    </div>
</template>

<style scoped lang="scss">
.menu-container {
    width: 100%;
    border: none !important;
    padding: 0 10px 10px 10px;
    box-sizing: border-box;
    :deep(.n-menu) {
        padding: 0 !important;
        .n-menu-item-content::before {
            left: 0 !important;
            right: 0 !important;
        }
        .n-menu-item {
            min-height: var(--n-item-height) !important;
            height: fit-content !important;
            margin: 0 0 5px 0 !important;
        }
        .n-menu-item-content {
            min-height: var(--n-item-height) !important;
            height: fit-content !important;
            padding-right: 15px !important;
            > .n-base-icon {
                font-size: 20px;
            }
        }
        > * {
            &:last-child {
                margin: 0 0 0 0 !important;
            }
        }
    }
}
</style>
