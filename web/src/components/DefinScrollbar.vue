<template>
    <el-scrollbar 
        ref="ElScrollbarRef"
        @scroll="handleScroll"
        :height="dataContainer.height">
        <slot></slot>
    </el-scrollbar>
</template>

<script>
/**
 * 自定义的滚动条
 * 可以记录滚动位置
 */
import {
    defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated,
    onMounted,
    computed,
    onDeactivated,
    toRef,
    watch,
    nextTick,
} from 'vue';

export default defineComponent({
    props:{
        type:String,
        default:'100%',
    },
    setup(props) {
        const ElScrollbarRef = ref(null);  //组件实例
        const dataContainer = reactive({
            height:toRef(props,'height'),
        });
        const otherDataContainer = {
            top:0,  //记录滚动条
            left:0,
        };
        /** 重新加载时候赋予旧值 */
        onActivated(()=>{
            nextTick(()=>{
                if(!ElScrollbarRef.value) return;
                ElScrollbarRef.value.setScrollTop(otherDataContainer.top);
                ElScrollbarRef.value.setScrollLeft(otherDataContainer.left);
            });
        });
        /** 滚动事件 */
        function handleScroll(e){
            e = e || {};
            otherDataContainer.top = e.scrollTop;
            otherDataContainer.left = e.scrollLeft;
        }
        return {
            dataContainer,
            ElScrollbarRef,
            handleScroll,
        };
    },
});
</script>
