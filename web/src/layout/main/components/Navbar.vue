<template>
<div 
    class="navbar-cp-container">
    <div class="left">
        <div class="logo-container">
            <el-image 
                @click="toPath({path:'/'})"
                class="logo"
                :src="'https://cn.bing.com/th?id=OHR.AdelieWPD_ZH-CN8434233391_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'" fit="cover" />
            <div class="name">
                毒蘑菇 - 管理
            </div>
        </div>
    </div>
    <div class="right">
        <div class="left">
            <div class="path-list-container">
                <el-breadcrumb separator="/">
                    <!-- <el-breadcrumb-item 
                        :to="{ path: '/main/index' }">
                        首页    
                    </el-breadcrumb-item> -->
                    <el-breadcrumb-item
                        v-for="item,index in dataContainer.breadcrumbList"
                        :to="item.path?{
                            path:item.path,
                        }:''">
                        <a 
                            v-if="item.isLink"
                            :href="item.path"
                            target="_blank">
                            {{item.title}}
                        </a>
                        <span v-else>
                            {{item.title}}
                        </span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="right">
            <a
                href="https://github.com/wurencaideli/dumogu-admin"
                target="_blank"
                class="bt">
                <SvgIcon
                    :style="'width:22px;height:22px;'"
                    name="git-hub"></SvgIcon>
            </a>
            <a
                href="https://txc.qq.com/products/613546"
                target="_blank"
                class="bt">
                <SvgIcon
                    :style="'width:22px;height:22px;'"
                    name="fankui"></SvgIcon>
            </a>
            <!-- <div
                class="bt">
                <SvgIcon
                    :style="'width:22px;height:22px;'"
                    name="commentlines-fill"></SvgIcon>
            </div> -->
            <div
                @click="toggleFullScreen" 
                class="bt">
                <SvgIcon
                    :style="'width:22px;height:22px;'"
                    name="Navbar-full"></SvgIcon>
            </div>
            <div class="bt user">
                <el-image 
                    class="img"
                    :src="dataContainer.userInfo.avatar"
                    fit="cover" />
                <div class="name">
                    管理员
                    <div class="other">
                        2458885747
                    </div>
                </div>
                <div class="option">
                    <SvgIcon
                        :style="'width:15px;height:15px;'"
                        name="sort-down"></SvgIcon>
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
        breadcrumbList:{
            type:Array,
            default:()=>{
                return [];
            },
        },
        userInfo:{
            type:Object,
            default:()=>{
                return {};
            },
        },
    },
    setup(props){
        const router = useRouter();
        const dataContainer = reactive({
            breadcrumbList:toRef(props,'breadcrumbList'),
            userInfo:toRef(props,'userInfo'),
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
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color:#444954;
    >.left{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        width: fit-content;
        >.logo-container{
            padding: 0 10px;
            box-sizing: border-box;
            width: var(--menu-width);
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            box-shadow: 0 0px 5px rgba(0, 0, 0, 0.177);
            >.logo{
                flex:1 1 0;
                width: 0;
                height: 50px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 15px;
            }
            >.name{
                width: max-content;
                font-size: 20px;
                font-weight: bold;
                color:#444954;
            }
        }
    }
    >.right{
        flex: 1 1 0;
        width: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        >.left{
            flex: 1 1 0;
            width: 0;
            >.path-list-container{
                padding: 0 15px;
                box-sizing: border-box;
            }
        }
        >.right{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            padding: 0 10px 0 0;
            box-sizing: border-box;
            >*{
                margin-left: 15px;
            }
            >.bt{
                width: 40px;
                height: 40px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border:1px solid #e7e7e9;
                border-radius: 8px;
                box-sizing: border-box;
                transition: all 0.2s;
                &:hover{
                    background-color: #eeeeee72;
                }
            }
            >.user{
                width: fit-content;
                height: fit-content;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.2s;
                position: relative;
                border: none;
                &:hover{
                    background-color: #dfdfdf;
                }
                >.img{
                    width: 45px;
                    min-width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    margin-right: 10px;
                    // border: 2px solid #949494;
                    box-shadow: #00000071 2px 2px 5px;
                }
                >.name{
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 5px;
                    color:#444954;
                    display: flex;
                    flex-direction: column;
                    >.other{
                        font-size: 13px;
                        opacity: 0.6;
                        margin-top: 2px;
                    }
                }
                >.option{
                    width: fit-content;
                    height: fit-content;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
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
}
</style>
