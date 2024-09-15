<template>
    <div class="collapse-el">
        <div ref="CollapseElRef" class="collapse-el-container">
            <div class="collapse-el-container-container">
                <slot></slot>
            </div>
        </div>
        <div v-if="showBt" class="collapse-el-show-container">
            <div @click="handleClick" class="container">
                <div
                    :class="{
                        bt: true,
                        show: show,
                    }"
                >
                    <SvgIcon :style="'width:15px;height:15px;'" name="svg:sort-down.svg"></SvgIcon>
                </div>
                {{ show ? '收缩' : '展开' }}
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 折叠组件
 */
import { defineComponent, ref, toRef, onMounted, watch, onBeforeUnmount } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';

export default defineComponent({
    name: 'Collapse',
    components: {
        SvgIcon,
    },
    props: {
        show: {
            //是否显示
            type: Boolean,
            default: true,
        },
        showBt: {
            //是否显示展开按钮
            type: Boolean,
            default: false,
        },
        anchorPointSignName: {
            //锚点标识（可用querySelector查询出来的标识）
            type: String,
            default: '.anchor-point-target',
        },
    },
    emits: ['onClick'],
    setup(props, { emit }) {
        const CollapseElRef = ref(null);
        const show = toRef(props, 'show');
        const showBt = toRef(props, 'showBt');
        const anchorPointSignName = toRef(props, 'anchorPointSignName');
        onMounted(() => {
            const childEl = CollapseElRef.value.firstChild;
            const resizeObserver = new ResizeObserver((entries) => {
                computHeight();
            });
            resizeObserver.observe(childEl);
        });
        let timer = null;
        watch(
            show,
            (newValue) => {
                computHeight();
            },
            {
                immediate: false,
            },
        );
        /** 表示是显示的 */
        function isActive() {
            if (!CollapseElRef.value) return false;
            const elRect = CollapseElRef.value.getBoundingClientRect();
            if (elRect.top == 0 && elRect.bottom == 0 && elRect.left == 0 && elRect.right == 0)
                return false;
            return true;
        }
        /** 设置显示高度 */
        function computHeight() {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!isActive()) return;
                if (show.value) {
                    const childHight =
                        CollapseElRef.value.firstChild.getBoundingClientRect().height;
                    CollapseElRef.value.style.height = childHight + 'px';
                } else {
                    //如果是隐藏的话找出锚点元素
                    const anchorPointEl = CollapseElRef.value.querySelector(
                        anchorPointSignName.value,
                    );
                    if (!anchorPointEl) {
                        CollapseElRef.value.style.height = 0 + 'px';
                    } else {
                        //表示只隐藏到锚点元素
                        const parentRect = CollapseElRef.value.getBoundingClientRect();
                        const anchorPointElRect = anchorPointEl.getBoundingClientRect();
                        const height =
                            anchorPointElRect.y - parentRect.y + anchorPointElRect.height;
                        CollapseElRef.value.style.height = height + 'px';
                    }
                }
            }, 26);
        }
        onBeforeUnmount(() => {
            clearTimeout(timer);
        });
        /** 收缩组件点击事件，向外部抛出 */
        function handleClick() {
            emit('onClick');
        }
        return {
            CollapseElRef,
            show,
            showBt,
            handleClick,
        };
    },
});
</script>

<style lang="scss" scoped>
.collapse-el {
    position: relative;
    width: 100%;
    height: auto;
    > .collapse-el-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        transition: all 0.2s;
        height: 0;
        > .collapse-el-container-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: fit-content;
        }
    }
    > .collapse-el-show-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: -7.5px;
        left: 0;
        width: 100%;
        pointer-events: none;
        > .container {
            width: fit-content;
            height: fit-content;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 12px;
            opacity: 0.5;
            pointer-events: initial;
            line-height: 1;
            > .bt {
                width: 15px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.2s;
                transform: rotate(0deg);
                &.show {
                    transform: rotate(180deg);
                }
            }
        }
    }
}
</style>
