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
                    :class="{
                        'item':true,
                        'active':index==1,
                    }">
                    标签 {{ index}}
                    <div class="bt">
                        <svg t="1697599667788" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9077" width="32" height="32"><path d="M639.125 512l217.96875-217.96875c14.4375-14.4375 14.4375-40.03125 0-54.46875l-72.65625-72.65625c-14.4375-14.4375-40.125-14.4375-54.46875 0L512 384.78125 294.03125 166.8125c-14.4375-14.4375-40.125-14.4375-54.46875 0l-72.65625 72.65625c-14.4375 14.4375-14.4375 40.125 0 54.46875L384.78125 512 166.8125 729.96875c-14.4375 14.4375-14.4375 40.125 0 54.46875l72.65625 72.65625c14.4375 14.4375 40.125 14.4375 54.46875 0L512 639.125l217.96875 217.96875c14.4375 14.4375 40.125 14.4375 54.46875 0l72.65625-72.65625c14.4375-14.4375 14.4375-40.03125 0-54.46875L639.125 512z" p-id="9078"></path></svg>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <div class="right">
        <div
            @click="toggleFullScreen" 
            class="bt">
            <svg t="1697616141094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12019" width="32" height="32"><path d="M867.126867 516.953333l-416-416A52.986667 52.986667 0 0 0 413.413533 85.333333H53.333533a53.393333 53.393333 0 0 0-53.333333 53.333334v360.08a52.986667 52.986667 0 0 0 15.62 37.713333l416 416a53.333333 53.333333 0 0 0 75.426667 0l360.08-360.08a53.4 53.4 0 0 0 0-75.426667zM341.333533 341.333333a85.333333 85.333333 0 1 1-85.333333-85.333333 85.426667 85.426667 0 0 1 85.333333 85.333333z m653.793334 251.046667l-382.706667 382.706667a21.333333 21.333333 0 0 1-30.173333-30.173334l382.706666-382.706666a10.666667 10.666667 0 0 0 0-15.08L539.5802 121.753333a21.333333 21.333333 0 0 1 30.173333-30.173333l425.373334 425.373333a53.4 53.4 0 0 1 0 75.426667z" fill="#5C5C66" p-id="12020"></path></svg>
        </div>
        <div class="bt-list-container">
            <div class="item">
                关闭当前
            </div>
            <div class="item">
                关闭其他
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
import SvgIcon from "@/components/svgIcon/index.vue";

export default {
    name: 'MyTabs',
    components: {
        SvgIcon,
    },
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
                padding: 5px 10px;
                box-sizing: border-box;
                border:1px solid rgb(196, 196, 196);
                margin-left: 5px;
                font-size: 13px;
                height: 30px;
                width: max-content;
                &.active{
                    background-color: #0072E5;
                    color: rgb(255, 255, 255);
                    font-weight: bold;
                }
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
                        margin-left: 10px;
                    }
                }
            }
        }
    }
    >.right{
        width: 50px;
        height: 100%;
        border-left: 1px solid rgb(218, 218, 218);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
        >.bt{
            width: 100%;
            height: 100%;
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
        >.bt-list-container{
            width: fit-content;
            min-width: 150px;
            position: absolute;
            z-index: 9;
            top: calc(100% + 0px);
            right: 0;
            background-color: rgb(255, 255, 255);
            box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.5);
            padding: 10px 0;
            box-sizing: border-box;
            border-radius: 3px;
            overflow: hidden;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            font-size: 15px;
            &:hover{
                opacity: 1;
                pointer-events: initial;
            }
            >.item{
                cursor: pointer;
                width: auto;
                min-width: max-content;
                transition: all 0.2s;
                padding: 13px 15px;
                box-sizing: border-box;
                display: block;
                color: #6b7386;
                text-align: center;
                &:hover{
                    background-color: rgba(194, 224, 255, 0.5);
                    color: #0072E5;
                }
            }
        }
        &:hover{
            .bt-list-container{
                opacity: 1;
                pointer-events: initial;
            }
        }
    }
}
</style>
