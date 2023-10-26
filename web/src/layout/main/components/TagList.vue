<template>
<div 
    class="tag-list-cp-container">
    <div 
        class="left"
        @wheel="handleScroll">
        <el-scrollbar 
            ref="ElScrollbarRef"
            height="100%">
            <draggable 
                class="scrollbar-container"
                item-key="sign"
                v-model="tagListTrans">
                <template #item="{element}">
                    <div
                        :class="{
                            'item':true,
                            'active':dataContainer.activeSign==element.sign,
                        }"
                        @click="handleClick(element)">
                        <div 
                            class="sign"
                            v-if="dataContainer.activeSign==element.sign">
                        </div>
                        {{element.title}}
                        <div
                            v-if="!element.fixed"
                            @click.stop="handleRemove(element)" 
                            class="bt">
                            <SvgIcon
                                :style="'width:12px;height:12px;'"
                                name="times"></SvgIcon>
                        </div>
                        <div 
                            v-if="element.isCache"
                            class="cache"></div>
                    </div>
                </template>
            </draggable>
        </el-scrollbar>
    </div>
    <div class="right">
        <div
            class="bt">
            <SvgIcon
                :style="'width:20px;height:20px;'"
                name="icon-drag"></SvgIcon>
        </div>
        <div class="bt-list-container">
            <div 
                v-if="dataContainer.tagList.length>1"
                class="item"
                @click="handleOptionClick(1)">
                <SvgIcon
                    :style="'width:16px;height:16px;'"
                    name="times"></SvgIcon>
                关闭当前标签页
            </div>
            <div 
                v-if="dataContainer.tagList.length>1"
                class="item"
                @click="handleOptionClick(2)">
                <SvgIcon
                    :style="'width:16px;height:16px;'"
                    name="times"></SvgIcon>
                关闭其他标签页
            </div>
            <div 
                v-if="dataContainer.tagList.length>1"
                class="item"
                @click="handleOptionClick(3)">
                <SvgIcon
                    :style="'width:16px;height:16px;'"
                    name="times"></SvgIcon>
                关闭左边标签页
            </div>
            <div 
                v-if="dataContainer.tagList.length>1"
                class="item"
                @click="handleOptionClick(4)">
                <SvgIcon
                    :style="'width:16px;height:16px;'"
                    name="times"></SvgIcon>
                关闭右边标签页
            </div>
            <div 
                class="item"
                @click="handleOptionClick(5)">
                <SvgIcon
                    :style="'width:16px;height:16px;'"
                    name="redo"></SvgIcon>
                刷新当前标签页
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
    nextTick,
} from "vue";
import SvgIcon from "@/components/svgIcon/index.vue";
import draggable from 'vuedraggable';

export default {
    name: 'TagList',
    components: {
        SvgIcon,
        draggable,
    },
    props:{
        /** 
         * 所显示的标签列表
         *  */
        /**
         * 一个tag例子的属性介绍
         */
        // {
        //     title:'标签一',  //标签标题
        //     sign:'/main/index',  //唯一标识
        //     fullPath:'/main/index',  //跳转地址，完整地址
        //     isCache:true,  //该标签页面是否缓存
        //     fixed:false,  //是否固定，不可删除
        // }
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
    emits:['onChange','onClick','onRemove','onOptionClick'],
    setup(props,{emit}){
        const ElScrollbarRef = ref(null);
        const dataContainer = reactive({
            tagList:toRef(props,'tagList'),
            activeSign:toRef(props,'activeSign'),
        });
        /** 用来排序转换的数组，由外部确定是否转换 */
        const tagListTrans = computed({
            get(){
                return dataContainer.tagList;
            },
            set(value){
                emit('onChange',value);
            },
        });
        /** 标签点击事件，向外部抛出 */
        function handleClick(item){
            emit('onClick',item);
        }
        /** 标签删除事件 */
        function handleRemove(item){
            emit('onRemove',item);
        }
        /** 操作事件 */
        function handleOptionClick(type){
            emit('onOptionClick',type);
        }
        /** 
         * 鼠标滚动事件
         * 横向滚动标签页
         *  */
        function handleScroll(e){
            if(!ElScrollbarRef.value) return;
            /** shift + 鼠标滚轮可以横向滚动 */
            if(e.shiftKey) return;
            let el = ElScrollbarRef.value.wrapRef;
            let scrollLeft = el.scrollLeft;
            if(e.deltaY < 0){
                scrollLeft = scrollLeft - 20;
            }else{
                scrollLeft = scrollLeft + 20;
            }
            el.scrollLeft = scrollLeft;
        }
        /** 
         * 自动滚动到相应标签
         * 防止标签没在视区
         */
        function autoScroll(){
            nextTick(()=>{
                if(!ElScrollbarRef.value) return;
                let el = ElScrollbarRef.value.wrapRef;
                let target = el.querySelector('.item.active');
                let rect = el.getBoundingClientRect();
                let rect_1 = target.getBoundingClientRect();
                if(rect_1.x < rect.x){
                    // 表示在左边遮挡
                    let scroll = rect.x - rect_1.x;
                    el.scrollLeft = el.scrollLeft - scroll - 5;
                }
                if(rect_1.x > (rect.x + rect.width)){
                    // 表示在右边遮挡
                    let scroll = rect_1.x - (rect.x + rect.width);
                    el.scrollLeft = el.scrollLeft + scroll + rect_1.width + 5;
                }
            });
        }
        watch(toRef(props,'activeSign'),()=>{
            autoScroll();
        });
        return {
            dataContainer,
            handleClick,
            handleRemove,
            handleOptionClick,
            tagListTrans,
            handleScroll,
            ElScrollbarRef,
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
        height: 100%;
        :deep(.el-scrollbar__view){
            height: 100%;
        }
        :deep(.scrollbar-container){
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: fit-content;
            height: 100%;
            .item{
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 5px 10px;
                box-sizing: border-box;
                margin-left: 5px;
                font-size: 13px;
                height: 30px;
                width: max-content;
                border-radius: 3px;
                color: rgb(91, 91, 91);
                position: relative;
                &:last-child{
                    margin-right: 5px;
                }
                &.active{
                    background-color: #dfdfdf;
                    color: #5240ff;
                    font-weight: bold;
                    // border:1px solid rgb(196, 196, 196);
                }
                >.sign{
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #5240ff;
                    margin-right: 5px;
                }
                >.bt{
                    width: fit-content;
                    height: fit-content;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-left: 5px;
                }
                >.cache{
                    width: 30%;
                    max-width: 30px;
                    min-width: 15px;
                    height: 3px;
                    border-radius: 999px;
                    background-color: #5340ff34;
                    position: absolute;
                    bottom: 0;
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
        }
        >.bt-list-container{
            width: fit-content;
            min-width: 150px;
            position: absolute;
            z-index: 9;
            top: calc(100% + 0px);
            right: 5px;
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
                padding: 15px 15px;
                box-sizing: border-box;
                display: block;
                color: #6b7386;
                text-align: left;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                >*{
                    margin-right: 5px;
                }
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
