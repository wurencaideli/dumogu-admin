<template>
    <DefinScrollbar height="100%" :showUpBt="true">
        <div class="page-container main-view">
            <div class="container">
                <p>当前加载时间：{{ dataContainer.nowTime }}</p>
                <p>当前加载时间戳：{{ dataContainer.nowTime_1 }}</p>
                <p>
                    标签页下方的小横条表示该标签页开始缓存，没有删除按钮的表示该标签页已固定，可在目录配置处配置
                </p>
                <p>
                    标签页固定的不可删除，可拖动排序，标签页删除后跳转到最近的一个标签上，可以手动调用
                </p>
                <p>可以点击切换查看缓存效果</p>
                <p>
                    <el-button @click="handleClick" type="primary"> 刷新当前标签页 </el-button>
                </p>
                <p>
                    <el-button @click="handleClick_1" type="primary">
                        <el-icon size="20px" color="#ffffff">
                            <Delete></Delete>
                        </el-icon>
                        跳转到另一个标签页，并且关闭当前标签页
                    </el-button>
                </p>
                <p>
                    <el-button @click="handleClick_2" type="primary">
                        更新标签信息（修改标题，切换缓存状态），不会更改目录配置，就是说重新重目录配置处创建该标签会使用目录的配置
                    </el-button>
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
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import { Delete } from '@element-plus/icons-vue';
import { findTag, updateTag, refreshTag, deleteTags } from '@/action/tagListTools';
import DefinScrollbar from '@/components/definScrollbar.vue';

export default defineComponent({
    components: {
        SvgIcon,
        Delete,
        DefinScrollbar,
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading: false,
            nowTime: new Date(),
            nowTime_1: new Date().getTime(),
        });
        /** 点击操作 */
        function handleClick() {
            let tag = findTag(route.path) || {};
            refreshTag(tag);
        }
        function handleClick_1() {
            let tag = findTag(route.path) || {};
            deleteTags({
                paths: tag.path,
                layoutName: tag.layoutName,
            });
            router.push({
                name: 'show-list-update',
                params: {
                    sign: '测试',
                },
            });
        }
        function handleClick_2() {
            let tag = findTag(route.path) || {};
            if (!tag) return;
            updateTag({
                tag: {
                    ...tag,
                    title: tag.title + '-1',
                    isCache: !tag.isCache,
                },
                layoutName: tag.layoutName,
            });
        }
        return {
            dataContainer,
            handleClick,
            handleClick_1,
            handleClick_2,
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
