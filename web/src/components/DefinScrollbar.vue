<template>
    <el-scrollbar 
        ref="ElScrollbarRef"
        @scroll="handleScroll"
        wrap-class="defin-scrollbar"
        :height="dataContainer.height">
        <slot></slot>
        <div
            v-if="dataContainer.showUpBt" 
            @click="handleUp"
            :class="{
                'scrollbar-up-bt':true,
                'show':dataContainer.show,
            }">
            UP
        </div>
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
import {simpleRoll} from "@/common/RollTolls";

export default defineComponent({
    props:{
        height:{
            type:String,
            default:'100%',
        },
        /** 是否显示回到顶部按钮 */
        showUpBt:{
            type:Boolean,
            default:false,
        },
    },
    emits:['onScroll'],
    setup(props,{emit}) {
        const ElScrollbarRef = ref(null);  //组件实例
        const dataContainer = reactive({
            height:toRef(props,'height'),
            showUpBt:toRef(props,'showUpBt'),
            show:false,
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
            /** 
             * 控制回到顶部按钮得显示
             * 大于一定阈值并且向下滚动才显示
             *  */
            if(e.scrollTop > 40 && (e.scrollTop > otherDataContainer.top)){
                dataContainer.show = true;
            }else{
                dataContainer.show = false;
            }
            otherDataContainer.top = e.scrollTop || 0;
            otherDataContainer.left = e.scrollLeft || 0;
            /** 向外部抛出事件 */
            emit('onScroll',e);
        }
        /** 回到顶部事件 */
        function handleUp(){
            if(!ElScrollbarRef.value) return;
            simpleRoll({
                target:ElScrollbarRef.value.wrapRef,
            });
        }
        return {
            dataContainer,
            ElScrollbarRef,
            handleScroll,
            handleUp,
        };
    },
});
</script>

<style lang="scss" scoped>
.defin-scrollbar{
    position: relative;
    .scrollbar-up-bt{
        position: absolute;
        bottom: 3vw;
        right: 3vw;
        width: 40px;
        height: 40px;
        background-color: rgb(255, 255, 255);
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
        box-shadow: 0px 0px 6px rgba(0, 0, 0, .3);
        &.show{
            opacity: 1;
            pointer-events: initial;
        }
    }
}
</style>
