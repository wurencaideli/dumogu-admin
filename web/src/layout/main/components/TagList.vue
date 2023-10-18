<template>
<div 
    class="tag-list-cp-container">
    <div class="left">
        <el-scrollbar 
            height="100%">
            <div 
                class="scrollbar-container">    
                <div
                    v-for="item,index in 50" 
                    :key="index"
                    class="item">
                    标签 {{ index}}
                    <div class="bt">
                        <svg t="1697599667788" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9077" width="32" height="32"><path d="M639.125 512l217.96875-217.96875c14.4375-14.4375 14.4375-40.03125 0-54.46875l-72.65625-72.65625c-14.4375-14.4375-40.125-14.4375-54.46875 0L512 384.78125 294.03125 166.8125c-14.4375-14.4375-40.125-14.4375-54.46875 0l-72.65625 72.65625c-14.4375 14.4375-14.4375 40.125 0 54.46875L384.78125 512 166.8125 729.96875c-14.4375 14.4375-14.4375 40.125 0 54.46875l72.65625 72.65625c14.4375 14.4375 40.125 14.4375 54.46875 0L512 639.125l217.96875 217.96875c14.4375 14.4375 40.125 14.4375 54.46875 0l72.65625-72.65625c14.4375-14.4375 14.4375-40.03125 0-54.46875L639.125 512z" p-id="9078"></path></svg>
                    </div>
                </div>
            </div>
        </el-scrollbar>
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
.tag-list-cp-container {
    height: 100%;
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    >.left{
        flex: 1 1 0;
        width: 0;
        .scrollbar-container{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: fit-content;
            >.item{
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                background-color: rgb(233, 233, 233);
                padding: 5px;
                box-sizing: border-box;
                border:1px solid rgb(196, 196, 196);
                margin-left: 5px;
                font-size: 13px;
                height: 30px;
                width: max-content;
                >.bt{
                    width: fit-content;
                    height: fit-content;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    >svg{
                        height: 15px;
                        width: 15px;
                        vertical-align: bottom;
                        margin-left: 5px;
                    }
                }
            }
        }
    }
}
</style>
