<template>
    <div class="menu-container">
        <el-scrollbar height="100%">
            <el-menu 
                :default-active="route.path"
                default-active="2">
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
        const dataContainer = reactive({
            dataList:toRef(props,'dataList'),
        });
        return {
            dataContainer,
            route,
        };
    },
};
</script>
<style scoped lang="scss">
.menu-container {
    height: 100%;
    width: 100%;
    :deep(.el-menu){
        border:none !important;
        --el-menu-base-level-padding:15px !important;
        --el-menu-icon-width:calc(15px + 0) !important; 
        --el-menu-item-height:55px !important;
        --el-menu-sub-item-height:55px !important;
        --el-menu-active-color:#5240ff !important;
        --el-menu-item-font-size:16px !important;
        --el-menu-text-color:rgb(91, 91, 91) !important;
        .el-sub-menu{
            &.is-active{
                background-color: #f1f1f1af;
            }
            .el-sub-menu__icon-arrow{
                font-size: 17px !important;
            }
        }
        .el-menu-item{
            &.is-active{
                background-color: #dfdfdf;
                font-weight: bold;
            }
        }
    }
}
</style>
