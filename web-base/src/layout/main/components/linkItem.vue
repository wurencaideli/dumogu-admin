<script>
import { reactive, toRef } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    name: 'LinkItem',
    components: {
        SvgIcon,
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
        const route = useRoute();
        const dataContainer = reactive({
            dataInfo: toRef(props, 'dataInfo'),
        });
        return {
            dataContainer,
            route,
        };
    },
};
</script>

<template>
    <div class="link-item-cp">
        <div class="top">
            <SvgIcon
                v-if="dataContainer.dataInfo.iconName"
                :style="'width: 17px;min-width:17px;height: 17px;'"
                :name="dataContainer.dataInfo.iconName"
            ></SvgIcon>
            {{ dataContainer.dataInfo.title }}
        </div>
        <div v-if="dataContainer.dataInfo.content" class="content">
            {{ dataContainer.dataInfo.content }}
        </div>
        <div v-if="dataContainer.dataInfo.number" class="sign">
            {{ dataContainer.dataInfo.number }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.link-item-cp {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 10px 0px;
    box-sizing: border-box;
    min-height: var(--el-menu-item-height);
    > .top {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        > * {
            margin-right: 10px;
        }
    }
    > .content {
        width: 100%;
        font-size: 12px;
        opacity: 0.8;
        font-weight: 400 !important;
        text-align: left;
        padding: 0 0 0 calc(0px);
        box-sizing: border-box;
        margin-top: 2px;
        white-space: nowrap; /* 保持文本在一行内 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 使用省略号表示溢出的内容 */
        color: #818c96;
    }
    > .sign {
        right: 0;
        position: absolute;
        width: fit-content;
        background-color: #ffe4e4;
        color: #f56c6c;
        border-radius: 999px;
        padding: 3px 8px;
        box-sizing: border-box;
        line-height: 1;
        font-size: 12px;
        margin: 0;
        font-weight: bold;
    }
}
</style>
