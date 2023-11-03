<template>
    <div class="menu-container">
        <el-scrollbar height="100%">
            <el-menu 
                ref="ElMenuRef"
                :default-active="route.path">
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
    --local-active-text-color:#5240ff;
    --local-active-bg-color:#5240ff30;
    --local-active-sub-bg-color:#f1f1f1af;
    --local-hover-color:#f1f1f1af;
    --local-font-size:16px;
    --local-text-color:rgb(91, 91, 91);
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
                border-radius: 5px;
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
                    font-weight: bold;
                    color: var(--el-menu-active-color);
                    box-shadow: inset 0 1px 4px #0000001f;
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
            border-radius: 5px;
            &.is-active{
                background-color: var(--active-item-bg-color);
                font-weight: bold;
                box-shadow: inset 0 1px 4px #0000001f;
            }
        }
    }
}
</style>
