<script>
/*
 * 404
 */
import { defineComponent,ref,getCurrentInstance,reactive,toRef, computed,onMounted,watch } from "vue";

export default defineComponent({
    setup(){
        const dataContainer = reactive({
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>    
<div 
    class="main-404-view">
    404
</div>
</template>

<style lang="scss" scoped>
.main-404-view{
    height: fit-content;
    font-weight: bold;
    line-height: 1.5;
}
</style>

