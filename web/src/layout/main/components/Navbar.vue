<template>
<div 
    class="navbar-cp-container">
    <div class="left">
        <el-image 
            class="logo"
            :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" fit="cover" />
    </div>
    <div class="right">
        <div class="bt">
            <svg t="1697598663799" 
                class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4016" 
                width="25" height="25"><path d="M170.666667 170.666667v213.333333H85.333333V85.333333h298.666667v85.333334H170.666667z m682.666666 213.333333V170.666667h-213.333333V85.333333h298.666667v298.666667h-85.333334zM170.666667 640v213.333333h213.333333v85.333334H85.333333v-298.666667h85.333334z m682.666666 0h85.333334v298.666667h-298.666667v-85.333334h213.333333v-213.333333z" fill="#2E2F30" p-id="4017"></path></svg>
        </div>
        <div class="bt user">
            <el-image 
                class="img"
                :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" fit="cover" />
            <div class="name">
                管理员
            </div>
            <div class="option">
                <svg t="1697599063633" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6297" width="32" height="32"><path d="M585.246075 875.340272l408.227201-447.966132c57.440818-63.040395 12.824837-164.374669-72.613865-164.374669H104.224378c-85.25807 0-130.054683 101.334274-72.613865 164.374669l408.407832 447.7855c39.016405 42.809667 106.211325 42.809667 145.22773 0.180632z" fill="#333333" p-id="6298"></path></svg>
            </div>
        </div>
    </div>
</div>
</template>
<script>
/*
 * 标签切换按钮组件
 * 提供类名供外部调整
 */
import { 
    defineComponent,ref,reactive, 
    computed,onMounted,watch,toRef,
    onUnmounted,
} from "vue";

export default {
    name: 'MyTabs',
    props:{
        activeIndex:{  //当前选择的index
            type:Number,
            default:0,
        },
        tabLength:{  //可切换的tab length
            type:Number,
            default:0,
        },
        gridStyle:{  //布局样式，等宽或自动
            type:String,
            default:'equal',
        },
    },
    setup(props){
        const MyTabsRef = ref(null);
        const ItemBgRef = ref(null);
        const dataContainer = reactive({
            show:false,
            timer:'',
            activeIndex:toRef(props,'activeIndex'),
            tabLength:toRef(props,'tabLength'),
            gridStyle:toRef(props,'gridStyle'),
        });
        /** 是否活跃 */
        function isActive(){
            const el = MyTabsRef.value;
            if(!el) return false;
            let react = el.getBoundingClientRect();
            /** 元素被隐藏了也不计算 */
            if(!react.width && !react.height) return false;
            return el.getRootNode() === document;
        }
        /** 计算位置 */
        function computedLocation(){ 
            const MyTabsEl = MyTabsRef.value;
            if(!MyTabsEl) return;
            if(!isActive()) return;
            const ItemEls = new Array(...MyTabsEl.children);
            if(!ItemEls) return;
            ItemEls.pop();
            dataContainer.show = ItemEls.length > 0;
            const ItemBgEl = ItemBgRef.value;
            if(!ItemBgEl) return;
            if(dataContainer.activeIndex<0 || dataContainer.activeIndex>=ItemEls.length) return;
            let left = ItemEls[dataContainer.activeIndex].offsetLeft;
            let top = ItemEls[dataContainer.activeIndex].offsetTop;
            let transform = `translate(${left}px, ${top}px)`;
            let width = ItemEls[dataContainer.activeIndex].clientWidth + 'px';
            let height = ItemEls[dataContainer.activeIndex].clientHeight + 'px';
            if(ItemBgEl.style.transform != transform){
                ItemBgEl.style.transform = transform;
            }
            if(ItemBgEl.style.width != width){
                ItemBgEl.style.width = width;
            }
            if(ItemBgEl.style.height != height){
                ItemBgEl.style.height = height;
            }
        }
        watch(props,()=>{
            computedLocation();
        });
        onMounted(()=>{
            computedLocation();
            /** 监听元素宽高变化 */
            let timer;
            window.addEventListener("resize",()=>{
                clearTimeout(timer);
                timer = setTimeout(()=>{
                    computedLocation();
                },150);
            });
            dataContainer.timer = setInterval(()=>{
                computedLocation();
            },150);
        });
        onUnmounted(()=>{
            clearInterval(dataContainer.timer);
        });
        return {
            MyTabsRef,
            ItemBgRef,
            dataContainer,
        };
    },
}
</script>
<style scoped lang="scss">
.navbar-cp-container {
    height: 100%;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    >.left{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        >.logo{
            width: 150px;
            height: 50px;
            border-radius: 5px;
        }
    }
    >.right{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        >*{
            margin-left: 15px;
        }
        >.bt{
            width: fit-content;
            height: fit-content;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            >svg{
                height: 25px;
                width: 25px;
                vertical-align: bottom;
            }
        }
        >.user{
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.2s;
            &:hover{
                background-color: rgb(224, 224, 224);
            }
            >.img{
                width: 40px;
                height: 40px;
                border-radius: 5px;
                margin-right: 5px;
            }
            >.name{
                font-size: 15px;
                margin-right: 5px;
            }
            >.option{
                width: fit-content;
                height: fit-content;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                >svg{
                    height: 10px;
                    width: 10px;
                    vertical-align: bottom;
                }
            }
        }
    }
}
</style>
