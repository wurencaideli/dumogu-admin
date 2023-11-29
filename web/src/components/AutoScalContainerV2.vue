<template>
    <div 
        class="auto-scal-container"
        ref="AutoScalContainerRef">
        <div 
            ref="DomRef" 
            class="auto-scal-container-inner">
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
    defineComponent,ref,getCurrentInstance,reactive,toRef, 
    computed,onMounted,onActivated,watch,
    onBeforeUnmount,
} from "vue";

export default defineComponent({
    props:{
        width:{
            type:Number,
            default:1920,
        },
        height:{
            type:Number,
            default:1080,
        },
        /** 内部容器的宽高比例 */
        ratio:{
            type:Number,
            default:1920 / 1080,
        },
    },
    emits:['onResizeScreen'],
    setup(props,{emit}){
        const DomRef = ref(null);  //组件实例
        const AutoScalContainerRef = ref(null);  //组件实例
        const dataContainer = reactive({
            height:toRef(props,'height'),
            width:toRef(props,'width'),
            ratio:toRef(props,'ratio'),
        });
        /** 是否是文档上 */
        function isActive(){
            if(!DomRef.value) return false;
            return DomRef.value.getRootNode() === document;
        }
        /** 自动缩放 */
        function autoResizeScreen(){
            if(!AutoScalContainerRef.value) return;
            if(!DomRef.value) return;
            if(!isActive) return;
            let rect = AutoScalContainerRef.value.getBoundingClientRect();
            let clientWidth = rect.width;
            let clientHeight = rect.height;
            let width = dataContainer.width;
            let height = dataContainer.height;
            let domWidth = 0;
            let domHeight = 0;
            /** 使用外部传入的比例或者传入的宽高计算比例 */
            let ratio = dataContainer.ratio || (width / height);
            // 获取比例  可视化区域的宽高比与 屏幕的宽高比  来进行对应屏幕的缩放
            if ((clientWidth / clientHeight) > ratio) {
                domHeight = clientHeight;
                domWidth = ratio * domHeight;
            } else {
                domWidth = clientWidth;
                domHeight = domWidth / ratio;
            }
            // 防止组件销毁后还执行设置状态s
            Object.assign(DomRef.value.style, {
                width: `${domWidth}px`,
                height: `${domHeight}px`,
            });
            /** 向外部通知已经计算缩放 */
            emit('onResizeScreen',{
                width:domWidth,
                height:domHeight,
            });
        }
        /** 防抖 */
        let timer_1;
        function fnContainer(){
            clearTimeout(timer_1);
            setTimeout(()=>{
                autoResizeScreen();
            },16);
        }
        let timer = setInterval(()=>{
            fnContainer();
        },300);
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
    justify-content: center;
    align-items: center;
    >.auto-scal-container-inner {
        position: absolute;
        overflow: hidden;
        transform-origin: left top;
        width: 0;
        height: 0;
    }
}
</style>
