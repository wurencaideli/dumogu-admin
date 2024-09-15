<template>
    <div
        class="my-tabs"
        ref="MyTabsRef"
        :style="{
            gridTemplateColumns:
                dataContainer.tabLength > 0
                    ? `repeat(${dataContainer.tabLength},${
                          gridStyle == 'equal' ? '1fr' : 'max-content'
                      })`
                    : '',
        }"
    >
        <slot></slot>
        <div
            v-show="
                dataContainer.show &&
                dataContainer.activeIndex >= 0 &&
                dataContainer.activeIndex < dataContainer.tabLength
            "
            ref="ItemBgRef"
            class="my-tabs-active-item-bg"
        ></div>
    </div>
</template>
<script>
/*
 * 标签切换按钮组件
 * 提供类名供外部调整
 */
import {
    defineComponent,
    ref,
    reactive,
    computed,
    onMounted,
    watch,
    toRef,
    onUnmounted,
} from 'vue';

export default {
    name: 'MyTabs',
    props: {
        activeIndex: {
            //当前选择的index
            type: Number,
            default: 0,
        },
        tabLength: {
            //可切换的tab length
            type: Number,
            default: 0,
        },
        gridStyle: {
            //布局样式，等宽或自动
            type: String,
            default: 'equal',
        },
    },
    setup(props) {
        const MyTabsRef = ref(null);
        const ItemBgRef = ref(null);
        const dataContainer = reactive({
            show: false,
            timer: '',
            activeIndex: toRef(props, 'activeIndex'),
            tabLength: toRef(props, 'tabLength'),
            gridStyle: toRef(props, 'gridStyle'),
        });
        /** 是否活跃 */
        function isActive() {
            const el = MyTabsRef.value;
            if (!el) return false;
            let react = el.getBoundingClientRect();
            /** 元素被隐藏了也不计算 */
            if (!react.width && !react.height) return false;
            return el.getRootNode() === document;
        }
        /** 计算位置 */
        function computedLocation() {
            const MyTabsEl = MyTabsRef.value;
            if (!MyTabsEl) return;
            if (!isActive()) return;
            const ItemEls = new Array(...MyTabsEl.children);
            if (!ItemEls) return;
            ItemEls.pop();
            dataContainer.show = ItemEls.length > 0;
            const ItemBgEl = ItemBgRef.value;
            if (!ItemBgEl) return;
            if (dataContainer.activeIndex < 0 || dataContainer.activeIndex >= ItemEls.length)
                return;
            let left = ItemEls[dataContainer.activeIndex].offsetLeft;
            let top = ItemEls[dataContainer.activeIndex].offsetTop;
            let transform = `translate(${left}px, ${top}px)`;
            let width = ItemEls[dataContainer.activeIndex].clientWidth + 'px';
            let height = ItemEls[dataContainer.activeIndex].clientHeight + 'px';
            if (ItemBgEl.style.transform != transform) {
                ItemBgEl.style.transform = transform;
            }
            if (ItemBgEl.style.width != width) {
                ItemBgEl.style.width = width;
            }
            if (ItemBgEl.style.height != height) {
                ItemBgEl.style.height = height;
            }
        }
        watch(props, () => {
            computedLocation();
        });
        onMounted(() => {
            computedLocation();
            /** 监听元素宽高变化 */
            let timer;
            window.addEventListener('resize', () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    computedLocation();
                }, 150);
            });
            dataContainer.timer = setInterval(() => {
                computedLocation();
            }, 150);
        });
        onUnmounted(() => {
            clearInterval(dataContainer.timer);
        });
        return {
            MyTabsRef,
            ItemBgRef,
            dataContainer,
        };
    },
};
</script>
<style scoped lang="scss">
.my-tabs {
    --my-tabs-padding: 3px;
    --my-tabs-border-radius: 5px;
    width: fit-content;
    height: fit-content;
    padding: var(--my-tabs-padding);
    box-sizing: border-box;
    background-color: rgb(240, 242, 245);
    border-radius: var(--my-tabs-border-radius);
    list-style: none;
    display: grid;
    position: relative;
    z-index: 0;
    > .my-tabs-active-item-bg {
        position: absolute;
        height: 0;
        width: 0;
        top: 0;
        left: 0;
        border-radius: var(--my-tabs-border-radius);
        transition: transform 0.3s, width 0.3s, height 0.3s;
        background-color: rgba(0, 132, 255, 0.08);
        pointer-events: none;
        z-index: -1;
    }
}
</style>
