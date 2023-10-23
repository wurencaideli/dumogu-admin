<template>
    <div class="page-container icon-list-view">
        <div class="container">
            <div 
                class="item"
                v-for="item,index in dataContainer.imgList"
                :key="index">
                <SvgIcon
                    :style="'width:30px;height:30px;'"
                    :name="item.name"></SvgIcon>
                <div class="name">
                    {{item.name}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 页面例子
 * 显示所有icon
 */
import {defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated} from 'vue';
import SvgIcon from "@/components/svgIcon/index.vue";
import {imgList} from "@/components/svgIcon/Common.js";

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        const dataContainer = reactive({
            imgList:imgList,
        });
        return {
            dataContainer,
        };
    },
});
</script>

<style lang="scss" scoped>
    .icon-list-view{
        display: flex;
        flex-direction: column;
        padding: 15px;
        box-sizing: border-box;
        >.container{
            padding: 15px;
            box-sizing: border-box;
            background-color: white;
            border-radius: 5px;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            >.item{
                width: 150px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                margin:0 15px 30px 0;
                >.name{
                    font-size: 15px;
                    margin-top: 10px;
                    text-align: center;
                }
            }
        }
    }
</style>
