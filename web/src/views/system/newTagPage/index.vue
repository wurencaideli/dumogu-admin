<template>
    <DefinScrollbar 
        height="100%"
        :showUpBt="true">
        <div
            :style="{
                '--bg-img_1':`url(${dataContainer.img.img_1})`,
            }" 
            class="page-container new-tag-page-view">
            <div class="container">
                <div class="search">
                    <el-input 
                        v-model="dataContainer.input" 
                        @change="handleSearch"
                        @input="handleSearch"
                        placeholder="请输入菜单名称进行过滤" />
                </div>
                <div class="item-list">
                    <div
                        v-for="item,index in dataContainer.menuList_v" 
                        :key="index"
                        class="item">
                        <div 
                            @click="handleClick(item)"
                            class="container">
                            <div class="icon">
                                <SvgIcon
                                    v-if="item.iconName"
                                    :style="'width: 25px;min-width:25px;height: 25px;'"
                                    :name="item.iconName"></SvgIcon>
                            </div>
                            <div class="name">
                                {{item.title}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefinScrollbar>
</template>

<script>
/**
 * 页面例子
 */
import {
    defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated,
    onMounted,
    toRef,
} from 'vue';
import { useRouter, useRoute } from "vue-router";
import SvgIcon from "@/components/svgIcon/index.vue";
import {
    Delete,
} from '@element-plus/icons-vue';
import {userData} from "@/store/User";
import {toTree,unfoldTreeList} from "@/common/MenuTools";
import {
    deleteCurrentTag,
} from "@/layout/main/common/TagListTools";
import DefinScrollbar from "@/components/DefinScrollbar.vue";
import {
    messageSuccess,messageError,
} from "@/action/MessagePrompt";
import img_1 from "./pro-upgrade-bg.svg";

export default defineComponent({
    components: {
        SvgIcon,
        Delete,
        DefinScrollbar,
    },
    setup() {
        let userDataStore = userData();
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading:false,
            form:{},
            nowTime:new Date(),
            nowTime_1:new Date().getTime(),
            showMenuList:toRef(userDataStore,'showMenuList'),
            menuList:[],
            menuList_v:[],
            input:[],
            img:{
                img_1,
            },
        });
        /** 
         * 数据初始化
         */
        function initData(){
            let params = route.params;
            if(!params.sign) return;
            dataContainer.form = {
                id:params.sign,
            };
            /** 初始化数据列表 */
            let menuList = unfoldTreeList(dataContainer.showMenuList,{
                childsKey:'childs',
                setParentKey:'parentSign',
                getParentKey:'sign',
            });
            dataContainer.menuList = menuList;
            dataContainer.menuList_v = menuList;
        }
        initData();
        /** 跳转相应链接 */
        function handleClick(params){
            if(!params.path) {
                messageError('没有可用于跳转的链接');
                return;
            };
            /** 如果是一个链接的话直接跳转 */
            if(params.isLink){
                window.open(params.path);
            }else{
                deleteCurrentTag();
                router.push(params.path);
            }
        }
        /** 
         * 搜索
         */
        function handleSearch(){
            dataContainer.menuList_v = dataContainer.menuList.filter(item=>{
                let value = item.title || '';
                return value.includes(dataContainer.input);
            });
        }
        return {
            dataContainer,
            initData,
            handleClick,
            handleSearch,
        };
    },
});
</script>

<style lang="scss" scoped>
    .new-tag-page-view{
        display: flex;
        flex-direction: column;
        width: 100%;
        >.container{
            background-color: white;
            width: 100%;
            height: fit-content;
            border-radius: 5px;
            padding: 60px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-image: url(https://cn.bing.com/th?id=OHR.KirkilaiTower_ZH-CN4058404632_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp);
            background-size: cover;
            background-repeat: no-repeat;
            box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.319);
            background-position: center top;
            >.search{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin-bottom: 30px;
                :deep(.el-input){
                    width: 100%;
                    max-width: 700px;
                    height: 50px;
                    border: 2px solid rgba(3,3,3,.215686);
                    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.319);
                    border-radius: 12px;
                    overflow: hidden;
                    font-size: 15px;
                    .el-input__wrapper{
                        box-shadow: none !important;
                    }
                }
            }
            >.item-list{
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
                >.item{
                    padding: 30px 30px;
                    >.container{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        cursor: pointer;
                        color: white;
                        &:hover{
                            >.icon{
                                transform: scale(1.1);
                                box-shadow: 3px 3px rgba(0,0,0,.1);
                            }
                            >.name{
                                color: #5240ff;
                                font-weight: bold;
                            }
                        }
                        >.icon{
                            width: 60px;
                            height: 60px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            background-color: rgb(240, 240, 240);
                            border-radius: 50%;
                            transition: all 0.2s;
                            border: 2px solid rgba(3,3,3,.215686);
                            box-sizing: border-box;
                            box-shadow: 1px 1px 1px 0 rgba(0,0,0,.653);
                            color: rgb(56, 56, 56);
                        }
                        >.name{
                            transition: all 0.2s;
                            width: 150px;
                            text-align: center;
                            position: absolute;
                            top:calc(100% + 10px);
                        }
                    }
                }
            }
        }
    }
</style>
