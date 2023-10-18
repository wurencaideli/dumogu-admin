<template>
    <div class="setup-show-bt">
        <el-tooltip 
            class="item" 
            effect="dark" 
            :content="showSearch ? '隐藏搜索' : '显示搜索'" 
            placement="top">
            <el-button 
                circle icon="Search" 
                @click="toggleSearch()"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button circle icon="Refresh" @click="refresh()" />
        </el-tooltip>
    </div>
</template>

<script>
/**
 * 设置显示的按钮组件
 */
import { defineComponent } from 'vue';
export default defineComponent({
    props:{
        showSearch:{
            type:Boolean,
            default:false,
        },
    },
    emits:['update:showSearch','queryTable'],
    setup(props,{emit}){
        function toggleSearch(){ 
            emit('update:showSearch',!props.showSearch);
        }
        function refresh() {
            emit('queryTable');
        }
        return {
            toggleSearch,refresh,
        };
    },
});
</script>

<style lang='scss' scoped>
.setup-show-bt{
    width: fit-content;
}
</style>