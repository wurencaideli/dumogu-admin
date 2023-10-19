<template>
    <div class="menu-container">
        <el-scrollbar height="100%">
            <el-menu default-active="2">
                <el-menu-item 
                    v-for="item,index in dataContainer.dataList"
                    :key="item.path"
                    @click="toPath(item.path)"
                    :index="(index+1)+''">
                    <span>{{item.title}}</span>
                </el-menu-item>
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

export default {
    name: 'Menu',
    components: {
        SvgIcon,
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
        /** 跳转相应链接 */
        function toPath(params){
            router.push(params);
        }
        return {
            dataContainer,
            toPath,
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
        .is-active{
            background-color: #f1f1f1;
        }
    }
}
</style>
