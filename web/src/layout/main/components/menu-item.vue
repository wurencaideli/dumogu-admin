<script>
import { reactive, toRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import SvgIcon from '@/components/svg-icon/index.vue';
import LinkItem from './link-item.vue';

export default {
    name: 'MenuItem',
    components: {
        SvgIcon,
        LinkItem,
    },
    props: {
        /** 所显示的数据列表 */
        dataInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    setup(props) {
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            dataInfo: toRef(props, 'dataInfo'),
        });
        /** 跳转相应链接 */
        function handleClick(params) {
            if (!params.path) return;
            /** 如果是一个链接的话直接跳转 */
            if (params.isLink) {
                window.open(params.path);
            } else {
                router.push(params.path);
            }
        }
        return {
            dataContainer,
            handleClick,
            route,
        };
    },
};
</script>

<template>
    <div class="menu-item-container">
        <!-- 没有子目录的 -->
        <el-menu-item
            v-if="!dataContainer.dataInfo.childs || dataContainer.dataInfo.childs.length == 0"
            :index="dataContainer.dataInfo.path"
            :class="{
                'is-active': dataContainer.dataInfo.path == route.path,
            }"
            @click="handleClick(dataContainer.dataInfo)"
        >
            <LinkItem :dataInfo="dataContainer.dataInfo"></LinkItem>
        </el-menu-item>
        <!-- 有子目录且父节点不可点击 -->
        <el-sub-menu v-else :index="dataContainer.dataInfo.title">
            <template #title>
                <LinkItem :dataInfo="dataContainer.dataInfo"></LinkItem>
            </template>
            <MenuItem
                v-for="(item, index) in dataContainer.dataInfo.childs"
                :key="item.path"
                :dataInfo="item"
            ></MenuItem>
        </el-sub-menu>
    </div>
</template>

<style scoped lang="scss">
.menu-item-container {
    height: fit-content;
    width: 100%;
}
</style>
