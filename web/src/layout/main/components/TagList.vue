<template>
<div 
    class="tag-list-cp-container">
    <div class="left">
        <el-scrollbar 
            height="100%">
            <div 
                class="scrollbar-container">    
                <div
                    v-for="item,index in dataContainer.tagList" 
                    :key="item.sign"
                    :class="{
                        'item':true,
                        'active':dataContainer.activeSign==item.sign,
                    }"
                    @click="handleClick(item)">
                    {{item.title}}
                    <div
                        v-if="!item.fixed"
                        @click.stop="handleRemove(item)" 
                        class="bt">
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
            <div class="item">
                关闭左边
            </div>
            <div class="item">
                关闭右边
            </div>
            <div class="item">
                关闭所有
            </div>
        </div>
    </div>
</div>
</template>
<script>
/*
 * 标签切换按钮组件
 * 由外部指定数据
 */
import { 
    defineComponent,ref,reactive, 
    computed,onMounted,watch,toRef,
    onUnmounted,
} from "vue";
import SvgIcon from "@/components/svgIcon/index.vue";

export default {
    name: 'TagList',
    components: {
        SvgIcon,
    },
    props:{
        /** 所显示的标签列表 */
        tagList:{
            type:Array,
            default:()=>{
                return [];
            },
        },
        /** 当前活动的唯一标识 */
        activeSign:{
            type:[Number,String],
            default:0,
        },
    },
    emits:['onClick','onRemove'],
    setup(props,{emit}){
        const dataContainer = reactive({
            tagList:toRef(props,'tagList'),
            activeSign:toRef(props,'activeSign'),
        });
        /** 标签点击事件，向外部抛出 */
        function handleClick(item){
            emit('onClick',item);
        }
        /** 标签删除事件 */
        function handleRemove(item){
            emit('onRemove',item);
        }
        return {
            dataContainer,
            handleClick,
            handleRemove,
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
            border-radius: 2px;
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
                padding: 10px 15px;
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
