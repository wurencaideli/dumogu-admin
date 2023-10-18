<template>
    <div class="menu-container">
        <el-scrollbar height="100%">
            <el-menu default-active="2">
                <el-menu-item 
                    v-for="item,index in 40"
                    :key="index"
                    :index="index">
                    <span>Navigator Four</span>
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

export default {
    name: 'Menu',
    setup(props) {
        const dataContainer = reactive({});
        return {
            dataContainer,
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
    }
}
</style>
