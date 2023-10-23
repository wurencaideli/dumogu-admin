<template>
    <div class="page-container icon-list-view">
        <div class="container">
            <el-tabs 
                v-model="dataContainer.activeName" class="demo-tabs">
                <el-tab-pane label="User" name="first">User</el-tab-pane>
                <el-tab-pane label="Password" name="second">Password</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
/**
 * 页面例子
 * 显示所有icon
 */
import {defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated} from 'vue';
import SvgIcon from "@/components/svgIcon/index.vue";

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        const dataContainer = reactive({
            activeName:'User',
        });
        return {
            dataContainer,
        };
    },
});
</script>

<style lang="scss" scoped>
    .icon-list-view{
        display: flex;
        flex-direction: column;
        padding: 15px;
        box-sizing: border-box;
        >.container{
            padding: 15px;
            box-sizing: border-box;
            background-color: white;
            border-radius: 5px;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
        }
    }
</style>
