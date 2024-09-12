<script>
/**
 * 自定义的滚动条
 * 可以记录滚动位置
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
    toRef,
    watch,
    nextTick,
} from 'vue';
import { simpleRoll } from '@/common/rollTolls';

export default defineComponent({
    props: {
        height: {
            type: String,
            default: '100%',
        },
        /** 是否显示回到顶部按钮 */
        showUpBt: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['onScroll'],
    setup(props, { emit }) {
        const ElScrollbarRef = ref(null); //组件实例
        const dataContainer = reactive({
            height: toRef(props, 'height'),
            showUpBt: toRef(props, 'showUpBt'),
            loading: toRef(props, 'loading'),
            show: false,
        });
        const otherDataContainer = {
            top: 0, //记录滚动条
            left: 0,
        };
        /** 重新加载时候赋予旧值 */
        onActivated(() => {
            nextTick(() => {
                if (!ElScrollbarRef.value) return;
                ElScrollbarRef.value.setScrollTop(otherDataContainer.top);
                ElScrollbarRef.value.setScrollLeft(otherDataContainer.left);
            });
        });
        /** 滚动事件 */
        function handleScroll(e) {
            e = e || {};
            /**
             * 控制回到顶部按钮得显示
             * 大于一定阈值并且向下滚动才显示
             *  */
            if (e.scrollTop > 40 && e.scrollTop > otherDataContainer.top) {
                dataContainer.show = true;
            } else {
                dataContainer.show = false;
            }
            otherDataContainer.top = e.scrollTop || 0;
            otherDataContainer.left = e.scrollLeft || 0;
            /** 向外部抛出事件 */
            emit('onScroll', e);
        }
        /** 回到顶部事件 */
        function handleUp() {
            if (!ElScrollbarRef.value) return;
            simpleRoll({
                target: ElScrollbarRef.value.wrapRef,
            });
        }
        /** 滚动到某一位置 */
        function handleTo(end) {
            if (!ElScrollbarRef.value) return;
            simpleRoll({
                end: end,
                target: ElScrollbarRef.value.wrapRef,
            });
        }
        return {
            dataContainer,
            ElScrollbarRef,
            handleScroll,
            handleUp,
            handleTo,
        };
    },
});
</script>

<template>
    <el-scrollbar
        ref="ElScrollbarRef"
        @scroll="handleScroll"
        wrap-class="defin-scrollbar"
        :height="dataContainer.height"
    >
        <slot></slot>
        <div
            v-if="dataContainer.showUpBt"
            @click="handleUp"
            :class="{
                'scrollbar-up-bt': true,
                show: dataContainer.show,
            }"
        >
            UP
        </div>
        <div
            :class="{
                'loading-v-el': true,
                'no-show': dataContainer.loading,
            }"
        >
            <div class="title">CODESS</div>
            <div class="loading"></div>
        </div>
    </el-scrollbar>
</template>

<style lang="scss" scoped>
.defin-scrollbar {
    position: relative;
    .scrollbar-up-bt {
        position: absolute;
        z-index: 999;
        bottom: 3vw;
        right: 3vw;
        width: 40px;
        height: 40px;
        background-color: #1f364d;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
        cursor: pointer;
        color: rgb(25, 137, 250);
        font-size: 20px;
        font-family: serif;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.667);
        &.show {
            opacity: 1;
            pointer-events: initial;
        }
    }
    .loading-v-el {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        color: #dde1e4;
        pointer-events: none;
        transition: all 0.3s;
        opacity: 0;
        // transform: scale(0.7);
        &.no-show {
            opacity: 0.2;
        }
    }
    .loading-v-el .title {
        position: absolute;
        font-size: 20px;
        font-family: Source Han Serif CN;
        font-weight: bold;
        letter-spacing: 5px;
        transform: translateY(100px);
        font-style: italic;
    }
    .loading-v-el .loading {
        position: absolute;
    }
    .loading-v-el .loading {
        width: 8px;
        height: 100px;
        border-radius: 4px;
        display: inline-block;
        position: relative;
        background: currentColor;
        color: #dde1e4;
        animation: loading-animation 0.3s 0.3s linear infinite alternate;
    }
    .loading-v-el .loading::after,
    .loading-v-el .loading::before {
        content: '';
        width: 8px;
        height: 100px;
        border-radius: 4px;
        background: currentColor;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 80px;
        animation: loading-animation 0.3s 0.45s linear infinite alternate;
    }
    .loading-v-el .loading::before {
        left: -80px;
        animation-delay: 0s;
    }
    @keyframes loading-animation {
        0% {
            height: 100px;
        }
        100% {
            height: 4.8px;
        }
    }
}
</style>
