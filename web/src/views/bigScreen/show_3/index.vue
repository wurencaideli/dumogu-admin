<script>
/** 
 * 大屏主页面
 * 采用缩放的形式进行适配，搭配rem的话很方便实用
 *  */
import { defineComponent,ref,getCurrentInstance,reactive,toRef, computed,onMounted,onActivated,watch } from "vue";
import ViewHead from "./components/ViewHead.vue";
import img_1 from "./assets/bg.png";
import img_2 from "./assets/1-1-bg.png";
import Box_1 from "./components/Box_1.vue";
import Box_2 from "./components/Box_2.vue";
import Box_3 from "./components/Box_3.vue";
import Box_4 from "./components/Box_4.vue";
import Box_5 from "./components/Box_5.vue";

export default defineComponent({
    name:'BigScreenView',
    components: {
        ViewHead,
        Box_1,
        Box_2,
        Box_3,
        Box_4,
        Box_5,
    },
    setup(){
        const dataContainer = reactive({
            loading:false,
            img:{
                img_1,
                img_2,
            },
        }); 
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <el-scrollbar 
        height="100vh">
        <div 
            class="big-screen-view"
            :style="{
                '--bg-img-1':`url(${dataContainer.img.img_1})`,
                '--bg-img-2':`url(${dataContainer.img.img_2})`,
            }" >
            <div class="head">
                <ViewHead
                    title="数据可视化大屏展示"></ViewHead>
            </div>
            <div class="content">
                <div class="top">
                    <Box_1></Box_1> 
                </div>
                <div class="content">
                    <div class="left">
                        <div class="box">
                            <Box_2></Box_2> 
                        </div>
                        <div class="box">
                            <Box_3></Box_3> 
                        </div>
                    </div>
                    <div class="right">
                        <div class="box">
                            <Box_4></Box_4> 
                        </div>
                        <div class="box">
                            <Box_5></Box_5> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>

<style lang="scss" scoped>
.big-screen-view{
    width: 1920px;
    height:1080px;
    overflow: hidden;
    background-color: #031045c7;
    display: flex;
    flex-direction: column;
    background-image: var(--bg-img-1);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    >.head{
        height: 91px;
    }
    >.content{
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        width: 100%;
        height: 0;
        >.top{
            width: 100%;
            height: 199px;
        }
        >.content{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex: 1 1 0;
            width: 100%;
            height: 0;
            padding: 0 15px 15px 15px;
            box-sizing: border-box;
            >.left,>.right{
                display: flex;
                flex-direction: column;
                >.box{
                    width: 100%;
                    flex: 1 1 0;
                    height: 0;
                    background-image: var(--bg-img-2);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    background-position: center;
                    margin: 0 0 15px 0;
                    &:last-child{
                        margin: 0;
                    }
                }
            }
            >.left{
                height: 100%;
                width: 550px;
            }
            >.right{
                height: 100%;
                width: 550px;
            }
        }
    }
}
</style>
