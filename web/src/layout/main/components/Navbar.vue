<template>
<div 
    class="navbar-cp-container">
    <div class="left">
        <div class="logo-container">
            <el-image 
                @click="toPath({path:'/'})"
                class="logo"
                :src="dataContainer.img.img_1" fit="cover" />
            <div class="name">
                毒蘑菇 - 管理
            </div>
        </div>
    </div>
    <div class="right">
        <div class="left">
            <div class="path-list-container">
                <el-breadcrumb separator="">
                    <!-- <el-breadcrumb-item 
                        :to="{ path: '/main/index' }">
                        首页    
                    </el-breadcrumb-item> -->
                    <el-breadcrumb-item
                        v-for="item,index in dataContainer.breadcrumbList"
                        :key="`${index}--${item.path}`"
                        :to="item.path?{
                            path:item.path,
                        }:''"
                        :class="{
                            'has-path':!!item.path,
                        }">
                        <a 
                            v-if="item.isLink"
                            :href="item.path"
                            class="item"
                            target="_blank">
                            {{item.title}}
                        </a>
                        <span v-else class="item">
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
        <div class="search-container">
            <div class="container">
                <div class="left">
                    <SvgIcon
                        :style="'width:17px;height:17px;margin-right:10px;'"
                        name="search-bt"></SvgIcon>
                    搜索
                </div>
                <div class="right">
                    Alt S
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
import img_1 from "@/assets/logo.png";
import {toggleFullScreen} from "@/common/OtherTools";

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
            img:{
                img_1,
            },
        });
        /** 跳转去相应页面 */
        function toPath(params){
            router.push(params);
        }
        /** 退出登录 */
        function onLogout() {
            confirm(
                '是否确认退出登录',
                '提示',
            ).then(()=>{
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
    position: relative;
    @media (max-width: 1100px) {
        >.right{
            >.left{
                >.path-list-container{
                    display: none !important;
                }
            }
        }
    }
    @media (max-width: 750px) {
        >.right{
            >.left{
                >.path-list-container{
                    display: none !important;
                }
            }
            >.search-container{
                display: none !important;
            }
        }
    }
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
            background-color: #153451e8;
            // color:#444954;
            color: #d2dde9;
            >.logo{
                // flex:1 1 0;
                width: 45px;
                height: 45px;
                border-radius: 5px;
                cursor: pointer;
                margin-right: 10px;
            }
            >.name{
                width: max-content;
                font-size: 20px;
                font-weight: bold;
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
        position: relative;
        height: 100%;
        >.left{
            flex: 1 1 0;
            width: 0;
            >.path-list-container{
                padding: 0 15px;
                box-sizing: border-box;
                mask-image: linear-gradient(90deg,#000 0%,#000 calc(100% - 50px),transparent);
                :deep(.el-breadcrumb){
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-wrap: nowrap;
                    width: max-content;
                    .el-breadcrumb__separator{
                        display: none;
                    }
                    .el-breadcrumb__item{
                        background-color: #f1efef;
                        padding: 10px 15px;
                        font-size: 13px;
                        display: block;
                        opacity: 0.8;
                        clip-path: polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%,8px 50%);
                        &:first-child{
                            clip-path: polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%) !important;
                            border-radius: 5px 0px 0 5px !important;
                        }
                        &:last-child{
                            background-color: #f1efef !important;
                            clip-path: polygon(0 0,100% 0,100% 100%,0 100%,8px 50%);
                            border-radius: 0 5px 5px 0;
                            opacity: 1;
                        }
                        &.has-path{
                            background-color: #e2e2e2;
                        }
                    }
                }
            }
        }
        >.right{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            padding: 0 0 0 0;
            box-sizing: border-box;
            position: relative;
            height: 100%;
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
                // border:1px solid #e7e7e9;
                border-radius: 8px;
                box-sizing: border-box;
                transition: all 0.2s;
                box-shadow: inset 0 1px 4px #0000001f;
                &:hover{
                    background-color: #eeeeee72;
                }
            }
            >.user{
                width: fit-content;
                height: fit-content;
                cursor: pointer;
                border-radius:0 0 0 0;
                transition: all 0.2s;
                position: relative;
                border: none;
                box-shadow: none;
                height: 100%;
                padding: 10px;
                margin-left: 10px;
                border-left: 1px solid var(--border-color);
                box-sizing: border-box;
                box-shadow: inset 0 1px 4px #00000010;
                &:hover{
                    background-color: #f0f0f0;
                    box-shadow: inset 0 1px 4px #0000002a;
                }
                >.img{
                    width: 43px;
                    min-width: 43px;
                    height: 43px;
                    border-radius: 50%;
                    margin-right: 10px;
                    // border: 2px solid #949494;
                    box-shadow: #0000002a 2px 2px 5px;
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
                    right: 10px;
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
                            box-shadow: inset 0 1px 4px #0000001f;
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
                            box-shadow: inset 0 1px 4px #0000001f;
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
        >.search-container{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            >.container{
                width: 300px;
                height: 40px;
                background-color: white;
                border:1px solid #e7e7e9;
                transition: all 0.2s;
                box-shadow: inset 0 1px 4px #0000001f;
                pointer-events: initial;
                border-radius: 8px;
                padding: 0 10px;
                box-sizing: border-box;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                >.left{
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    font-size: 15px;
                    color: rgb(94, 94, 94);
                }
                >.right{
                    border: 1px solid rgb(209, 209, 209);
                    padding: 3px 5px;
                    font-size: 12px;
                    border-radius: 5px;
                    font-weight: bold;
                    color: rgb(121, 121, 121);
                }
            }
        }
    }
}
</style>
