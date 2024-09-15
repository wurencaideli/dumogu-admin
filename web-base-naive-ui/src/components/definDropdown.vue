<script>
/*
 * 自定义下拉菜单
 */
import { defineComponent, ref, reactive, toRef, onUnmounted } from 'vue';

export default defineComponent({
    name: 'DefinDropdown',
    components: {},
    props: {
        /** 是否显示下拉菜单 */
        show: {
            type: Boolean,
            default: false,
        },
        ifLeftClick: {
            type: Boolean,
            default: true,
        },
        targetQuery: {
            type: String,
            default: '.target',
        },
        position: {
            type: String,
            default: 'outside,bottom,end', // 分为 inside and outside
        },
    },
    emits: ['onOtherClick', 'onClick'],
    setup(props, { emit }) {
        const DefinDropTargetRef = ref(null);
        const DefinDropContainerRef = ref(null);
        const dataContainer = reactive({
            show: toRef(props, 'show'),
            targetQuery: toRef(props, 'targetQuery'),
            position: toRef(props, 'position'),
            ifLeftClick: toRef(props, 'ifLeftClick'),
            location: {},
        });
        const otherContainer = {
            activeTarget: null,
        };
        /** 鼠标点击事件 */
        function handleClick(e, ifLeftClick = true) {
            if (dataContainer.ifLeftClick != ifLeftClick) return;
            if (!e || !e.target) return;
            if (!DefinDropTargetRef.value) return;
            if (!DefinDropContainerRef.value) return;
            let el = DefinDropTargetRef.value;
            let targetList = el.querySelectorAll(dataContainer.targetQuery); //.可用于操作的目标
            let target; //被点击的目标
            targetList.forEach((item) => {
                if (item.contains(e.target) || e.target == item) {
                    target = item;
                }
            });
            if (!target) return;
            let rect = el.getBoundingClientRect();
            let rect_1 = target.getBoundingClientRect();
            let rect_2 = DefinDropContainerRef.value.getBoundingClientRect();
            let position = dataContainer.position;
            let location = {
                x: rect_1.x - rect.x,
                y: rect_1.y - rect.y,
            };
            if (position == 'outside,top,start') {
                location.y = location.y - rect_2.height;
                location.x = location.x;
            }
            if (position == 'outside,top,end') {
                location.y = location.y - rect_2.height;
                location.x = location.x - rect_2.width + rect_1.width;
            }
            if (position == 'outside,right,start') {
                location.y = location.y;
                location.x = location.x + rect_1.width;
            }
            if (position == 'outside,right,end') {
                location.y = location.y - rect_2.height + rect_1.height;
                location.x = location.x + rect_1.width;
            }
            if (position == 'outside,bottom,start') {
                location.y = location.y + rect_1.height;
                location.x = location.x;
            }
            if (position == 'outside,bottom,end') {
                location.y = location.y + rect_1.height;
                location.x = location.x - rect_2.width + rect_1.width;
            }
            if (position == 'outside,left,start') {
                location.y = location.y;
                location.x = location.x - rect_2.width;
            }
            if (position == 'outside,left,end') {
                location.y = location.y - rect_2.height + rect_1.height;
                location.x = location.x - rect_2.width;
            }
            if (position == 'inside,top,right') {
                location.y = location.y;
                location.x = location.x - rect_2.width + rect_1.width;
            }
            if (position == 'inside,right,bottom') {
                location.y = location.y - rect_2.height + rect_1.height;
                location.x = location.x - rect_2.width + rect_1.width;
            }
            if (position == 'inside,bottom,left') {
                location.y = location.y - rect_2.height + rect_1.height;
                location.x = location.x;
            }
            if (position == 'inside,left,top') {
                location.y = location.y;
                location.x = location.x;
            }
            DefinDropContainerRef.value.style.top = location.y + 'px';
            DefinDropContainerRef.value.style.left = location.x + 'px';
            /** 保证触发在全局点击事件后 */
            setTimeout(() => {
                otherContainer.activeTarget = target;
                emit('onClick');
            }, 0);
        }
        /** 初始化隐藏事件 */
        function initHiddenEvent() {
            function callbackFn(e) {
                if (!dataContainer.show) return;
                if (!DefinDropTargetRef.value) return;
                if (!DefinDropContainerRef.value) return;
                if (!e || !e.target) return;
                if (
                    !DefinDropTargetRef.value.contains(e.target) &&
                    !DefinDropContainerRef.value.contains(e.target)
                ) {
                    emit('onOtherClick');
                    return;
                }
                let el = DefinDropTargetRef.value;
                let targetList = el.querySelectorAll(dataContainer.targetQuery); //.可用于操作的目标
                let target; //被点击的目标
                targetList.forEach((item) => {
                    if (item.contains(e.target) || e.target == item) {
                        target = item;
                    }
                });
                if (!target || otherContainer.activeTarget != target) {
                    emit('onOtherClick');
                    return;
                }
            }
            document.addEventListener('click', callbackFn);
            onUnmounted(() => {
                document.removeEventListener('click', callbackFn);
            });
        }
        initHiddenEvent();
        return {
            dataContainer,
            DefinDropTargetRef,
            handleClick,
            DefinDropContainerRef,
        };
    },
});
</script>

<template>
    <div class="defin-drop">
        <div
            class="defin-drop-target"
            ref="DefinDropTargetRef"
            @click="handleClick"
            @contextmenu.prevent="
                (e) => {
                    handleClick(e, false);
                }
            "
        >
            <slot></slot>
        </div>
        <div
            ref="DefinDropContainerRef"
            :class="{
                'defin-drop-container': true,
                show: dataContainer.show,
            }"
        >
            <div class="defin-drop-container-a">
                <slot name="dropdown"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.defin-drop {
    position: relative;
    pointer-events: none;
    > .defin-drop-target {
        pointer-events: initial;
    }
    > .defin-drop-container {
        top: 0;
        right: 0;
        position: absolute;
        pointer-events: none;
        width: fit-content;
        height: fit-content;
        &.show {
            :deep(.defin-drop-container-a) {
                opacity: 1 !important;
                pointer-events: initial !important;
                transform: scale(1) !important;
            }
        }
        :deep(.defin-drop-container-a) {
            opacity: 0;
            transition: transform 0.2s, opacity 0.2s;
            transform: scale(0);
            width: fit-content;
            height: fit-content;
        }
    }
    :deep(.bt-list-container) {
        min-width: 150px;
        display: flex;
        flex-direction: column;
        width: max-content;
        background-color: #1f1f23;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0px 4px rgba(0, 0, 0, 0.4);
        padding: 0px 0;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid #ffffff1d;
        overflow: hidden;
        > .item {
            min-width: 150px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding: 17px 25px;
            box-sizing: border-box;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            color: rgb(206, 206, 206);
            border-bottom: 1px solid #ffffff1d;
            border-left: none;
            border-right: none;
            line-height: 1;
            > * {
                margin-right: 15px;
            }
            &:hover {
                background-color: rgba(145, 145, 162, 0.17);
                color: #007fff;
            }
            &:last-child {
                border-bottom: none;
            }
            &.logout {
                color: #c95050;
            }
        }
    }
}
</style>
