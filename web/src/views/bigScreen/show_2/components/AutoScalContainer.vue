<template>
    <div class="auto-scal-container">
        <div 
            ref="DomRef" 
            class="auto-scal-container-inner">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/** 
 * 自动缩放容器
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
    },
    components: {
        
    },
    setup(props){
        const DomRef = ref(null);  //组件实例
        const dataContainer = reactive({
            height:toRef(props,'height'),
            width:toRef(props,'width'),
        });
        /** 是否是文档上 */
        function isActive(){
            if(!DomRef.value) return false;
            return DomRef.value.getRootNode() === document;
        }
        /** 自动缩放 */
        function autoResizeScreen(){
            if(!DomRef.value) return;
            if(!isActive) return;
            const { clientWidth, clientHeight } = document.body;
            var width = dataContainer.width;
            var height = dataContainer.height;
            let left;
            let top;
            let scale;
            // 获取比例  可视化区域的宽高比与 屏幕的宽高比  来进行对应屏幕的缩放
            if ((clientWidth / clientHeight) > (width / height)) {
                scale = clientHeight / height;
                top = 0;
                left = (clientWidth - width * scale) / 2;
            } else {
                scale = clientWidth / width;
                left = 0;
                top = (clientHeight - height * scale) / 2;
            }
            // 防止组件销毁后还执行设置状态s
            Object.assign(DomRef.value.style, {
                transform: `scale(${scale})`,
                left: `${left}px`,
                top: `${top}px`,
            });
        }
        /** 防抖 */
        let timer_1;
        function fnContainer(){
            clearTimeout(timer_1);
            setTimeout(()=>{
                autoResizeScreen();
            },300);
        }
        let timer = setInterval(()=>{
            fnContainer();
        },3000);
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
        };
    },
});
</script>

<style lang="scss" scoped>
.auto-scal-container {
    width: 100%;
    height: 100%;
    position: relative;
    >.auto-scal-container-inner {
        overflow: hidden;
        transform-origin: left top;
        z-index: 999;
        transition: all 0.15s;
        width: max-content;
        height: max-content;
        position: absolute;
    }
}
</style>
