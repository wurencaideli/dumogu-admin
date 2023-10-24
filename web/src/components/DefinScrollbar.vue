<template>
    <el-scrollbar 
        ref="ElScrollbarRef"
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
} from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

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
        };
        onActivated(()=>{
            if(!ElScrollbarRef.value) return;
            ElScrollbarRef.value.setScrollTop(otherDataContainer.top);
        });
        onBeforeRouteLeave(()=>{
            if(!ElScrollbarRef.value) return;
            otherDataContainer.top = ElScrollbarRef.value.wrapRef.scrollTop;
        });
        return {
            dataContainer,
            ElScrollbarRef,
        };
    },
});
</script>
