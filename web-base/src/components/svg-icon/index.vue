<script>
/**
 * 自定义的icon组件
 * 外部可传入需要使用的icon的名称，注意是全名
 */
import { defineComponent, ref, reactive, toRef, computed } from 'vue';
import { iconNameMap } from './common.js';

export default defineComponent({
    name: 'SvgIcon',
    props: {
        name: {
            // icon 名称
            type: String,
            default: '',
        },
        style: {
            // icon 对应的样式
            type: String,
            default: '',
        },
    },
    setup(props) {
        const dataContainer = reactive({
            name: toRef(props, 'name'),
            style: toRef(props, 'style'),
        });
        /** icon 个体数据 */
        const iconData = computed(() => {
            return iconNameMap.get(dataContainer.name) || {};
        });
        return {
            dataContainer,
            iconData,
        };
    },
});
</script>

<template>
    <div class="svg-icon" v-show="iconData.name" :style="dataContainer.style">
        <div class="icon-container-svg" v-if="iconData.type == 'svg'" v-html="iconData.svg"></div>
        <img
            class="icon-container-img"
            v-if="iconData.type == 'img'"
            :src="iconData.src"
            :alt="iconData.name"
        />
    </div>
</template>

<style lang="scss" scoped>
.svg-icon {
    width: 20px;
    height: 20px;
    line-height: 1;
    > .icon-container-svg {
        width: 100%;
        height: 100%;
        :deep(svg) {
            object-fit: cover;
            height: 100%;
            width: 100%;
            // vertical-align: bottom;
            display: block;
            fill: currentColor;
            /** 所有的颜色都使用外部的color属性 */
            path {
                fill: currentColor;
            }
        }
    }
    > .icon-container-img {
        // vertical-align: bottom;
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}
</style>
