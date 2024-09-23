<script>
/**
 * 自定义的滚动条
 * 可以记录滚动位置
 */
import {
    defineComponent,
    ref,
    reactive,
    onActivated,
    toRef,
    nextTick,
    onMounted,
    onUnmounted,
} from 'vue';
import { simpleRoll } from '@/common/rollTolls';
import { throttleFn } from '@/common/debounceAndThrottle';
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

export default defineComponent({
    components: {
        simplebar,
    },
    props: {
        /** 是否显示回到顶部按钮 */
        showUpBt: {
            type: Boolean,
            default: false,
        },
        /** 加载状态 */
        loading: {
            type: Boolean,
            default: false,
        },
        /** 内容被遮挡时的阴影 */
        showMask: {
            type: Boolean,
            default: true,
        },
        maskShadowColor: {
            type: String,
            default: '#0000006b',
        },
    },
    emits: ['onScroll'],
    setup(props, { emit }) {
        const DefinScrollbarRef = ref(null); //组件实例
        const dataContainer = reactive({
            showUpBt: toRef(props, 'showUpBt'),
            loading: toRef(props, 'loading'),
            showMask: toRef(props, 'showMask'),
            maskShadowColor: toRef(props, 'maskShadowColor'),
            show: false,
        });
        const otherDataContainer = {
            top: 0, //记录滚动条
            left: 0,
            target: null, //滚动容器元素
        };
        /** 页面加载好了找出滚动容器 */
        onMounted(() => {
            if (!DefinScrollbarRef.value) return;
            let wrapRef = DefinScrollbarRef.value.querySelector('.simplebar-content-wrapper');
            if (!wrapRef) return;
            otherDataContainer.target = wrapRef;
            wrapRef.addEventListener('scroll', handleScroll);
        });
        /** 重新加载时候赋予旧值 */
        onActivated(() => {
            nextTick(() => {
                if (!otherDataContainer.target) return;
                otherDataContainer.target.scrollTop = otherDataContainer.top || 0;
                otherDataContainer.target.scrollLeft = otherDataContainer.left || 0;
            });
        });
        /** 处理样式 */
        const handleStyle = throttleFn(function () {
            if (!DefinScrollbarRef.value) return;
            if (!otherDataContainer.target) return;
            if (!dataContainer.showMask) return;
            let element = DefinScrollbarRef.value;
            element.classList.remove('show-top', 'show-left', 'show-bottom', 'show-right');
            let el = otherDataContainer.target;
            let scrollRight = el.scrollWidth - el.clientWidth - el.scrollLeft;
            let scrollBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
            /** 表示左边被遮挡 */
            if (el.scrollLeft > 0) {
                element.classList.add('show-left');
            }
            /** 表示右边边被遮挡 */
            if (scrollRight > 0) {
                element.classList.add('show-right');
            }
            /** 表示上边被遮挡 */
            if (el.scrollTop > 0) {
                element.classList.add('show-top');
            }
            /** 表示下边边被遮挡 */
            if (scrollBottom > 0) {
                element.classList.add('show-bottom');
            }
        }, 70);
        let timer = setInterval(() => {
            handleStyle();
        }, 500);
        onUnmounted(() => {
            clearInterval(timer);
        });
        /** 滚动事件 */
        function handleScroll(e) {
            if (!e || !e.target) return;
            e = e.target;
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
            /** 添加自定义class */
            handleStyle();
        }
        /** 回到顶部事件 */
        function handleUp() {
            if (!otherDataContainer.target) return;
            let wrapRef = otherDataContainer.target;
            if (!wrapRef) return;
            simpleRoll({
                top: 0,
                time: 150,
                target: wrapRef,
            });
        }
        /** 滚动到某一位置params {left:0,top:0} */
        function handleTo(params) {
            if (!otherDataContainer.target) return;
            let wrapRef = otherDataContainer.target;
            if (!wrapRef) return;
            simpleRoll(
                Object.assign(
                    {
                        target: wrapRef,
                    },
                    params,
                ),
            );
        }
        return {
            dataContainer,
            DefinScrollbarRef,
            handleScroll,
            handleUp,
            handleTo,
        };
    },
});
</script>

<template>
    <div
        :style="{
            '--shadow-color-1': dataContainer.maskShadowColor,
        }"
        ref="DefinScrollbarRef"
        class="defin-scrollbar"
    >
        <simplebar class="defin-scrollbar-simplebar">
            <slot></slot>
        </simplebar>
        <div v-if="dataContainer.showMask" class="top"></div>
        <div v-if="dataContainer.showMask" class="right"></div>
        <div v-if="dataContainer.showMask" class="bottom"></div>
        <div v-if="dataContainer.showMask" class="left"></div>
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
            <div class="title">LOADING...</div>
            <div class="loading"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.defin-scrollbar {
    position: relative;
    width: 100%;
    height: 100%;
    --mask-size: 5px;
    --shadow-color-1: #0000006b;
    &.show-left {
        > .left {
            opacity: 1;
        }
    }
    &.show-right {
        > .right {
            opacity: 1;
        }
    }
    &.show-top {
        > .top {
            opacity: 1;
        }
    }
    &.show-bottom {
        > .bottom {
            opacity: 1;
        }
    }
    > .left,
    > .right,
    > .top,
    > .bottom {
        pointer-events: none;
        position: absolute;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 999;
    }
    > .top {
        top: 0;
        left: 0;
        width: 100%;
        height: var(--mask-size);
        background-image: linear-gradient(to bottom, var(--shadow-color-1), transparent);
    }
    > .right {
        top: 0;
        right: 0;
        width: var(--mask-size);
        height: 100%;
        background-image: linear-gradient(to right, transparent, var(--shadow-color-1));
    }
    > .bottom {
        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--mask-size);
        background-image: linear-gradient(to bottom, transparent, var(--shadow-color-1));
    }
    > .left {
        top: 0;
        left: 0;
        width: var(--mask-size);
        height: 100%;
        background-image: linear-gradient(to right, var(--shadow-color-1), transparent);
    }
    :deep(.defin-scrollbar-simplebar) {
        width: 100%;
        height: 100%;
        .simplebar-vertical {
            width: 12px;
        }
        .simplebar-scrollbar:before {
            border-radius: 2px !important;
            background-color: rgb(0, 0, 0);
        }
    }
    > .scrollbar-up-bt {
        position: absolute;
        z-index: 999;
        bottom: 3vw;
        right: 3vw;
        width: 40px;
        height: 40px;
        background-color: #282828;
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
        font-weight: bold;
        font-family: serif;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.667);
        &.show {
            opacity: 1;
            pointer-events: initial;
        }
        &:hover {
            transform: scale(1.1);
        }
    }
    > .loading-v-el {
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
        &.no-show {
            opacity: 0.2;
        }
    }
    > .loading-v-el .title {
        position: absolute;
        font-size: 20px;
        font-family: Source Han Serif CN;
        font-weight: bold;
        letter-spacing: 5px;
        transform: translateY(100px);
        font-style: italic;
    }
    > .loading-v-el .loading {
        position: absolute;
    }
    > .loading-v-el .loading {
        width: 8px;
        height: 100px;
        border-radius: 4px;
        display: inline-block;
        position: relative;
        background: currentColor;
        color: #dde1e4;
        animation: loading-animation 0.3s 0.3s linear infinite alternate;
    }
    > .loading-v-el .loading::after,
    > .loading-v-el .loading::before {
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
    > .loading-v-el .loading::before {
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
