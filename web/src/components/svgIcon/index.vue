<template>
    <div 
        class="svg-icon"
        v-show="dataContainer.imgMap[dataContainer.name]"
        v-html="dataContainer.imgMap[dataContainer.name]"
        :style="dataContainer.style">
    </div>
</template>
  
<script>
/** 
 * 自定义的icon组件
 */
import { defineComponent,ref,reactive,toRef } from 'vue';
import {imgMap} from "./Common.js";

export default defineComponent({
    name:'SvgIcon',
    props:{
        name: {  // icon 名称
            type: String,
            default: '',
        },
        style: {  // icon 对应的样式
            type:String,
            default:'',
        },
    },
    setup(props){
        const dataContainer = reactive({
            name:toRef(props,'name'),
            style:toRef(props,'style'),
            imgMap:imgMap,
        });
        return {
            dataContainer,
        };
    },
});
</script>
  
<style lang="scss" scoped>
.svg-icon{
    width: 20px;
    height: 20px;
    :deep(svg){
        object-fit: cover;
        height: 100%;
        width: 100%;
        vertical-align: bottom;
        fill: currentColor;
        /** 所有的颜色都使用外部的color属性 */
        path{
            fill: currentColor;
        }
    }
}
</style>