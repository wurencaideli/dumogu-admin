<script>
/*
 * 401
 */
import { defineComponent,ref,getCurrentInstance,reactive,toRef, computed,onMounted,watch } from "vue";
import svg401 from "@/assets/img-list/401.svg";

export default defineComponent({
    setup(){
        const dataContainer = reactive({
            svg401:svg401,
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>    
<div 
    class="main-401-view">
    <div class="container">
        <img
            :src="dataContainer.svg401"/>
        <div class="right">
            <div class="title">
                401错误!无访问权限
            </div>
            <div class="content">
                对不起，您正在寻找的页面没有访问权限。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。或者向管理员申请访问权限。
            </div>
            <router-link 
                class="bt"
                to="/main/index">
                返回首页
            </router-link>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.main-401-view{
    height: 100vh;
    width:100vw;
    font-weight: bold;
    line-height: 1.5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    >.container{
        display: flex;
        flex-direction: row;
        align-items: center;
        >img{
            width:500px;
            height:500px;
        }
        >.right{
            margin-left:30px;
            max-width:500px;
            >.title{
                font-size: 32px;
                font-weight: bold;
                line-height: 40px;
                color: #1482f0;
                margin-bottom: 40px;
            }
            >.content{
                font-size: 13px;
                line-height: 21px;
                color: grey;
                margin-bottom: 40px;
                max-width:300px;
            }
            >.bt{
                width: 110px;
                height: 36px;
                background: #1482f0;
                border-radius: 100px;
                text-align: center;
                color: #ffffff;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>

