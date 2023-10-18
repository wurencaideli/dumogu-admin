<template>
    <div 
        class="collapse-el"
        ref="CollapseElRef">
        <div class="collapse-el-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/**
 * 折叠组件
 */
import { defineComponent,ref,toRef } from 'vue';

export default defineComponent({
    name:'Collapse',
    props:{
        show:{  //是否显示
            type:Boolean,
            default:true,
        },
        anchorPointSignName:{  //锚点标识（可用querySelector查询出来的标识）
            type:String,
            default:'.anchor-point-target',
        },
    },
    setup(props){
        const CollapseElRef = ref(null);
        const show = toRef(props,'show');
        const anchorPointSignName = toRef(props,'anchorPointSignName');
        onMounted(() => {
            const childEl = CollapseElRef.value.firstChild;
            const resizeObserver = new ResizeObserver((entries) => {
                computHeight();
            });
            resizeObserver.observe(childEl);
        });
        let timer = null;
        watch(show,(newValue)=>{
            computHeight();
        },{
            immediate:false,
        });
        /** 表示是显示的 */
        function isActive(){
            if(!CollapseElRef.value) return false;
            const elRect = CollapseElRef.value.getBoundingClientRect();
            if(elRect.top==0 && elRect.bottom==0 && elRect.left==0 && elRect.right==0) return false;
            return true;
        }
        /** 设置显示高度 */
        function computHeight(){
            clearTimeout(timer);
            timer = setTimeout(()=>{
                if (!isActive()) return;
                if(show.value){
                    const childHight = CollapseElRef.value.firstChild.getBoundingClientRect().height;
                    CollapseElRef.value.style.height = childHight + 'px';
                }else{
                    //如果是隐藏的话找出锚点元素
                    const anchorPointEl = CollapseElRef.value.querySelector(anchorPointSignName.value);
                    if(!anchorPointEl){
                        CollapseElRef.value.style.height = 0 + 'px';
                    }else{  //表示只隐藏到锚点元素
                        const parentRect = CollapseElRef.value.getBoundingClientRect();
                        const anchorPointElRect = anchorPointEl.getBoundingClientRect();
                        const height = anchorPointElRect.y - parentRect.y + anchorPointElRect.height;
                        CollapseElRef.value.style.height = height + 'px';
                    }
                }
            }, 26);
        }
        onBeforeUnmount(()=>{
            clearTimeout(timer);
        });
        return {
            CollapseElRef,
            show,
        };
    },
});
</script>

<style lang='scss' scoped>
.collapse-el{
    position: relative;
    width: 100%;
    overflow: hidden;
    transition: all 0.2s;
    height: 0;
    >.collapse-el-container{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: fit-content;
    }
}
</style>