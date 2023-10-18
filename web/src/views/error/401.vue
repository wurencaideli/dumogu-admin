<script>
/*
 * 401
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
    class="main-401-view">
    401
</div>
</template>

<style lang="scss" scoped>
.main-401-view{
    height: fit-content;
    font-weight: bold;
    line-height: 1.5;
}
</style>

