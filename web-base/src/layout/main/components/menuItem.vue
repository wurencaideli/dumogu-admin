<template>
    <div class="menu-item-container">
        <!-- 没有子目录的 -->
        <el-menu-item
            v-if="!dataContainer.dataInfo.childs || dataContainer.dataInfo.childs.length==0"
            :index="dataContainer.dataInfo.path"
            :class="{
                'is-active':dataContainer.dataInfo.path==route.path,
            }"
            @click="handleClick(dataContainer.dataInfo)">
            <div class="item-target">
                <SvgIcon
                    v-if="dataContainer.dataInfo.iconName"
                    :style="'width: 17px;min-width:17px;height: 17px;'"
                    :name="dataContainer.dataInfo.iconName"></SvgIcon>
                {{dataContainer.dataInfo.title}}
                <div
                    v-if="dataContainer.dataInfo.content"
                    class="content">
                    {{dataContainer.dataInfo.content}}
                </div>
                <div
                    v-if="dataContainer.dataInfo.number"
                    class="sign">
                    {{dataContainer.dataInfo.number}}
                </div>
            </div>
        </el-menu-item>
        <!-- 有子目录且父节点可点击 -->
        <el-sub-menu 
            v-else-if="dataContainer.dataInfo.path"
            :class="{
                'is-sub-defin-active':route.path==dataContainer.dataInfo.path,
            }"
            :index="dataContainer.dataInfo.path">
            <template #title>
                <div 
                    class="item-target"
                    @click.stop="handleClick(dataContainer.dataInfo)">
                    <SvgIcon
                        v-if="dataContainer.dataInfo.iconName"
                        :style="'width: 17px;min-width:17px;height: 17px;'"
                        :name="dataContainer.dataInfo.iconName"></SvgIcon>
                    {{dataContainer.dataInfo.title}}
                    <div
                        v-if="dataContainer.dataInfo.content"
                        class="content">
                        {{dataContainer.dataInfo.content}}
                    </div>
                    <div
                        v-if="dataContainer.dataInfo.number"
                        class="sign">
                        {{dataContainer.dataInfo.number}}
                    </div>
                </div>
            </template>
            <MenuItem
                v-for="item,index in dataContainer.dataInfo.childs"
                :key="item.path"
                :dataInfo="item"></MenuItem>
        </el-sub-menu>
        <!-- 有子目录且父节点不可点击 -->
        <el-sub-menu 
            v-else
            :index="dataContainer.dataInfo.sign">
            <template #title>
                <div class="item-target">
                    <SvgIcon
                        v-if="dataContainer.dataInfo.iconName"
                        :style="'width: 17px;min-width:17px;height: 17px;'"
                        :name="dataContainer.dataInfo.iconName"></SvgIcon>
                    {{dataContainer.dataInfo.title}}
                    <div
                        v-if="dataContainer.dataInfo.content"
                        class="content">
                        {{dataContainer.dataInfo.content}}
                    </div>
                    <div
                        v-if="dataContainer.dataInfo.number"
                        class="sign">
                        {{dataContainer.dataInfo.number}}
                    </div>
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
            if(!params.path) return;
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
            route,
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
        position: relative;
        >*{
            margin-right: 10px;
        }
        >.sign{
            right: 0;
            position: absolute;
            width: fit-content;
            background-color: #ffe4e4;
            color: #f56c6c;
            border-radius: 999px;
            padding: 5px 10px;
            box-sizing: border-box;
            line-height: 1;
            font-size: 12px;
            margin: 0;
            font-weight: bold;
        }
        >.content{
            font-size: 12px;
            margin-left: 5px;
            opacity: 0.8;
            font-weight: 400 !important;
        }
    }
}
</style>
