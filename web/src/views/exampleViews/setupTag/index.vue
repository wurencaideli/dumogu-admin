<template>
    <el-scrollbar 
        height="100%">
        <div class="page-container main-view">
            <div class="container">
                <p>
                    当前加载时间：{{dataContainer.nowTime}}
                </p>
                <p>
                    当前加载时间戳：{{dataContainer.nowTime_1}}
                </p>
                <p>
                    <el-button 
                        @click="handleClick"
                        type="primary">
                        刷新当前标签页
                    </el-button>
                </p>
                <p>
                    <el-button 
                        @click="handleClick_1"
                        type="primary">
                        <el-icon size="20px" color="#ffffff">
                            <Delete></Delete>
                        </el-icon>
                        跳转到另一个标签页，并且关闭当前标签页
                    </el-button>
                </p>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
/**
 * 页面例子
 */
import {
    defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated,
    onMounted,
} from 'vue';
import { useRouter } from "vue-router";
import SvgIcon from "@/components/svgIcon/index.vue";
import {
    Delete,
} from '@element-plus/icons-vue';
import {
    deleteCurrentTag,
    refreshCurrentTag,
} from "@/layout/main/Common/TagListTools";

export default defineComponent({
    components: {
        SvgIcon,
        Delete,
    },
    setup() {
        const router = useRouter();
        const dataContainer = reactive({
            loading:false,
            nowTime:new Date(),
            nowTime_1:new Date().getTime(),
        });
        /** 点击操作 */
        function handleClick(){
            refreshCurrentTag();
        }
        function handleClick_1(){
            deleteCurrentTag();
            router.push({
                name:'show-list-update',
                params:{
                    sign:'测试',
                },
            });
        }
        return {
            dataContainer,
            handleClick,
            handleClick_1,
        };
    },
});
</script>

<style lang="scss" scoped>
    .main-view{
        display: flex;
        flex-direction: column;
        width: 100%;
        .container{
            background-color: white;
            width: 100%;
            // min-height: 800px;
            height: fit-content;
            border-radius: 5px;
            padding: 30px;
            box-sizing: border-box;
            >*{
                margin: 0 0 30px 0;
                &:last-child{
                    margin: 0;
                }
            }
        }
    }
</style>
