<template>
<div 
    class="navbar-cp-container">
    <div class="left">
        <el-image 
            @click="toPath({path:'/'})"
            class="logo"
            :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" fit="cover" />
        <div class="name">
            毒蘑菇 - 管理
        </div>
    </div>
    <div class="right">
        <div
            @click="toggleFullScreen" 
            class="bt">
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
            <div class="bt-list-container">
                <div class="item">
                    <router-link 
                        to="/main/mine?activeTab=0">
                        个人中心
                    </router-link>
                </div>
                <div class="item">
                    <router-link 
                        to="/main/mine?activeTab=2">
                        密码修改
                    </router-link>
                </div>
                <div 
                    class="logout-bt"
                    @click.stop="onLogout">
                    退出登录
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
/*
 * 头部组件
 * 提供类名供外部调整
 */
import { 
    defineComponent,ref,reactive, 
    computed,onMounted,watch,toRef,
    onUnmounted,
} from "vue";
import { useRouter } from "vue-router";
import SvgIcon from "@/components/svgIcon/index.vue";
import {logout} from "@/action/FormatUserData";
import {confirm} from "@/action/MessagePrompt";

export default {
    name: 'Navbar',
    components: {
        SvgIcon,
    },
    props:{
        
    },
    setup(props){
        const router = useRouter();
        const dataContainer = reactive({
            
        });
        /** 全屏事件 */
        function toggleFullScreen() {
            var elem = document.documentElement; // 获取文档根元素
            if (!document.fullscreenElement && // 当前不在全屏模式
                !document.mozFullScreenElement && 
                !document.webkitFullscreenElement && 
                !document.msFullscreenElement) {  // 也适用于IE/Edge
                if (elem.requestFullscreen) {
                elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) { // Firefox
                elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { // IE/Edge
                elem.msRequestFullscreen();
                }
            } else { // 当前在全屏模式，退出全屏
                if (document.exitFullscreen) {
                document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
                document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
                }
            }
        }
        /** 跳转去相应页面 */
        function toPath(params){
            router.push(params);
        }
        /** 退出登录 */
        function onLogout() {
            confirm('是否确认退出登录').then(()=>{
                logout();
                toPath('/login');
            }).catch(()=>{
                return;
            });
        }
        return {
            dataContainer,
            toPath,
            toggleFullScreen,
            onLogout,
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
            cursor: pointer;
            margin-right: 20px;
        }
        >.name{
            font-size: 20px;
            font-weight: bold;
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
            position: relative;
            &:hover{
                background-color: rgba(194, 224, 255, 0.5);
            }
            >.img{
                width: 40px;
                height: 40px;
                border-radius: 5px;
                margin-right: 10px;
            }
            >.name{
                font-size: 15px;
                margin-right: 10px;
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
                    width: auto;
                    min-width: max-content;
                    transition: all 0.2s;
                    &:hover{
                        background-color: rgba(194, 224, 255, 0.5);
                        :deep(a){
                            color: #0072E5;
                        }
                    }
                    :deep(a){
                        padding: 13px 15px;
                        box-sizing: border-box;
                        display: block;
                        color: #6b7386;
                        text-align: center;
                    }
                }
                >.logout-bt{
                    cursor: pointer;
                    padding: 13px 15px;
                    box-sizing: border-box;
                    background-color: #fef0f0;
                    color: #f56c6c;
                    transition: all 0.2s;
                    text-align: center;
                    &:hover{
                        color: #f14242;
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
}
</style>
