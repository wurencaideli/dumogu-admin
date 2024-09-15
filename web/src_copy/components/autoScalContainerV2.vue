<template>
    <div class="auto-scal-container" ref="AutoScalContainerRef">
        <div ref="DomRef" class="auto-scal-container-inner">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/**
 * 自动缩放容器，改变宽高进行缩放
 * 容器内显示指定的比例
 *  */
import {
    defineComponent,
    ref,
    getCurrentInstance,
    reactive,
    toRef,
    computed,
    onMounted,
    onActivated,
    watch,
    onBeforeUnmount,
} from 'vue';

export default defineComponent({
    props: {
        width: {
            type: Number,
            default: 1920,
        },
        height: {
            type: Number,
            default: 1080,
        },
        /** 内部容器的宽高比例 */
        ratio: {
            type: Number,
            default: 1920 / 1080,
        },
        /**
         * fit，原理同img的object-fit
         * contain : 被替换的内容将被缩放，以在填充元素的内容框时保持其宽高比。
         * cover : 被替换的内容在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框。
         *  */
        fit: {
            type: String,
            default: 'contain',
        },
    },
    emits: ['onResizeScreen'],
    setup(props, { emit }) {
        const DomRef = ref(null); //组件实例
        const AutoScalContainerRef = ref(null); //组件实例
        const dataContainer = reactive({
            height: toRef(props, 'height'),
            width: toRef(props, 'width'),
            ratio: toRef(props, 'ratio'),
            fit: toRef(props, 'fit'),
        });
        /** 是否是文档上 */
        function isActive() {
            if (!DomRef.value) return false;
            return DomRef.value.getRootNode() === document;
        }
        /** 自动缩放 */
        function autoResizeScreen() {
            if (!AutoScalContainerRef.value) return;
            if (!DomRef.value) return;
            if (!isActive) return;
            let rect = AutoScalContainerRef.value.getBoundingClientRect();
            let clientWidth = rect.width;
            let clientHeight = rect.height;
            let width = dataContainer.width;
            let height = dataContainer.height;
            let domWidth = 0;
            let domHeight = 0;
            let domTop = 0;
            let domLeft = 0;
            /** 使用外部传入的比例或者传入的宽高计算比例 */
            let ratio = dataContainer.ratio || width / height;
            // 获取比例  可视化区域的宽高比与 屏幕的宽高比  来进行对应屏幕的缩放
            if (dataContainer.fit == 'contain') {
                if (clientWidth / clientHeight > ratio) {
                    domHeight = clientHeight;
                    domWidth = ratio * domHeight;
                    domTop = 0;
                    domLeft = (clientWidth - domWidth) / 2;
                } else {
                    domWidth = clientWidth;
                    domHeight = domWidth / ratio;
                    domTop = (clientHeight - domHeight) / 2;
                    domLeft = 0;
                }
            }
            if (dataContainer.fit == 'cover') {
                if (clientWidth / clientHeight > ratio) {
                    domWidth = clientWidth;
                    domHeight = domWidth / ratio;
                } else {
                    domHeight = clientHeight;
                    domWidth = ratio * domHeight;
                }
            }
            // 防止组件销毁后还执行设置状态s
            Object.assign(DomRef.value.style, {
                width: `${domWidth}px`,
                height: `${domHeight}px`,
                top: `${domTop}px`,
                left: `${domLeft}px`,
            });
            /** 向外部通知已经计算缩放 */
            emit('onResizeScreen', {
                width: domWidth,
                height: domHeight,
            });
        }
        /** 防抖 */
        let timer_1;
        function fnContainer() {
            clearTimeout(timer_1);
            // timer_1 = setTimeout(()=>{
            autoResizeScreen();
            // },16);
        }
        let timer = setInterval(() => {
            fnContainer();
        }, 300);
        onMounted(() => {
            autoResizeScreen();
        });
        window.addEventListener('resize', fnContainer);
        onBeforeUnmount(() => {
            window.removeEventListener('resize', fnContainer);
            window.clearInterval(timer);
        });
        return {
            dataContainer,
            DomRef,
            AutoScalContainerRef,
        };
    },
});
</script>

<style lang="scss" scoped>
.auto-scal-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: auto;
    /** 隐藏滚动条 */
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
    > .auto-scal-container-inner {
        position: absolute;
        overflow: hidden;
        transform-origin: left top;
        width: 0;
        height: 0;
        top: 0;
        left: 0;
    }
}
</style>
