<template>
    <div class="menu-item-container">
        <el-menu-item
            v-if="!dataContainer.dataInfo.childs || dataContainer.dataInfo.childs.length==0"
            :index="dataContainer.dataInfo.path"
            @click="handleClick(dataContainer.dataInfo)">
            <div class="item-target">
                <SvgIcon
                    v-if="dataContainer.dataInfo.iconName"
                    :style="'width: 23px;height: 23px;'"
                    :name="dataContainer.dataInfo.iconName"></SvgIcon>
                {{dataContainer.dataInfo.title}}
            </div>
        </el-menu-item>
        <el-sub-menu 
            v-else
            :index="dataContainer.dataInfo.path">
            <template #title>
                <div class="item-target">
                    <SvgIcon
                        v-if="dataContainer.dataInfo.iconName"
                        :style="'width: 23px;height: 23px;'"
                        :name="dataContainer.dataInfo.iconName"></SvgIcon>
                    {{dataContainer.dataInfo.title}}
                </div>
            </template>
            <MenuItem
                v-for="item,index in dataContainer.dataInfo.childs"
                :key="item.path"
                :dataInfo="item"></MenuItem>
        </el-sub-menu>
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
    name: 'MenuItem',
    components: {
        SvgIcon,
    },
    props:{
        /** 所显示的数据列表 */
        dataInfo:{
            type:Object,
            default:()=>{
                return {};
            },
        },
    },
    setup(props) {
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            dataInfo:toRef(props,'dataInfo'),
        });
        /** 跳转相应链接 */
        function handleClick(params){
            /** 如果是一个链接的话直接跳转 */
            if(params.isLink){
                window.open(params.path);
            }else{
                router.push(params.path);
            }
        }
        return {
            dataContainer,
            handleClick,
        };
    },
};
</script>
<style scoped lang="scss">
.menu-item-container {
    height: fit-content;
    width: 100%;
    :deep(.item-target){
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        >*{
            margin-right: 5px;
        }
    }
}
</style>
