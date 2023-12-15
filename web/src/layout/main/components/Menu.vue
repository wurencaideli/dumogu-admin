<template>
    <div class="menu-container">
        <el-scrollbar 
            height="100%">
            <el-menu 
                ref="ElMenuRef"
                :collapse="false"
                :default-active="route.path"
                :router="false">
                <MenuItem
                    v-for="item,index in dataContainer.dataList"
                    :key="item.path"
                    :dataInfo="item"></MenuItem>
            </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>
import {
    defineComponent,
    ref,
    reactive,
    computed,
    onMounted,
    watch,
    toRef,
    onUnmounted,
} from 'vue';
import SvgIcon from "@/components/svgIcon/index.vue";
import { useRouter,useRoute } from "vue-router";
import MenuItem from "./MenuItem.vue";

export default {
    name: 'Menu',
    components: {
        SvgIcon,
        MenuItem,
    },
    props:{
        /** 所显示的数据列表 */
        dataList:{
            type:Array,
            default:()=>{
                return [];
            },
        },
    },
    setup(props) {
        const router = useRouter();
        const route = useRoute();
        const ElMenuRef = ref(null);
        const dataContainer = reactive({
            dataList:toRef(props,'dataList'),
        });
        /** 
         * 当页面加载后设置设置当前打开的父节点，因为如果父节点可点击的话不会自动打开
         * */
        onMounted(()=>{
            if(!ElMenuRef.value) return;
            let el = ElMenuRef.value.$el;
            let hasActiveSubEl = el.querySelector('.el-sub-menu .is-sub-defin-active');
            if(!hasActiveSubEl) return;
            ElMenuRef.value.open(route.path);
        });
        return {
            dataContainer,
            route,
            ElMenuRef,
        };
    },
};
</script>
<style scoped lang="scss">
.menu-container {
    height: 100%;
    width: 100%;
    /** 基础目录配置 */
    --local-active-text-color:#ffffff;
    --local-active-bg-color:#5240ff96;
    --local-active-sub-bg-color:#3634ac57;
    --local-hover-color:#3634ac57;
    --local-font-size:15px;
    --local-text-color:#a8bacc;
    --local-box-shadow: 0 1px 4px #001247;
    --local-border-radius:8px;
    :deep(.el-menu){
        border:none !important;
        --el-menu-active-color:var(--local-active-text-color) !important;
        --el-menu-item-font-size:var(--local-font-size) !important;
        --el-menu-text-color:var(--local-text-color) !important;
        --el-menu-hover-bg-color:var(--local-hover-color) !important;
        --active-item-bg-color:var(--local-active-bg-color) !important;
        --el-menu-bg-color:transparent !important;
        --el-menu-base-level-padding:15px !important;
        --el-menu-level-padding:20px !important;
        --el-menu-icon-width:calc(15px + 0) !important; 
        --el-menu-item-height:55px !important;
        --el-menu-sub-item-height:55px !important;
        --active-sub-bg-color:transparent !important;
        padding: 10px;
        box-sizing: border-box;
        .el-sub-menu__icon-arrow{
            margin-top: 0 !important;
            top:initial !important;
        }
        .el-menu{
            padding: 0;
        }
        .el-sub-menu{
            >.el-sub-menu__title{
                border-radius: var(--local-border-radius);
            }
            &.is-active{
                background-color: var(--active-sub-bg-color);
                >.el-sub-menu__title{
                    background-color: var(--local-active-sub-bg-color);
                }
            }
            .el-sub-menu__icon-arrow{
                font-size: 17px !important;
            }
            &.is-sub-defin-active{
                >.el-sub-menu__title{
                    background-color: var(--active-item-bg-color);
                    // font-weight: bold;
                    color: var(--el-menu-active-color);
                    box-shadow: var(--local-box-shadow);
                }
            }
            /** 表示有已经活动的sub目录 */
            &:has(.is-sub-defin-active){
                background-color: var(--active-sub-bg-color);
                >.el-sub-menu__title{
                    background-color: var(--local-active-sub-bg-color);
                }
            }
        }
        .el-menu-item{
            border-radius: var(--local-border-radius);
            &.is-active{
                background-color: var(--active-item-bg-color);
                // font-weight: bold;
                box-shadow: var(--local-box-shadow);
            }
        }
    }
    :deep(.el-scrollbar){
        .el-scrollbar__bar{
            .el-scrollbar__thumb{
                background-color: rgba(194, 194, 194, 0.51) !important;
            }
        }
    }
}
</style>
