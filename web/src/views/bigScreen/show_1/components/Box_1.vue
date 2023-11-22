<script>
/** 
 * 盒子
 *  */
import { defineComponent,ref,getCurrentInstance,reactive,toRef, computed,onMounted,onActivated,watch } from "vue";

export default defineComponent({
    components:{
    },
    props:{
        dataInfo:{
            type:Object,
            default:()=>{
                return {};
            },
        },
    },
    setup(props){
        const dataContainer = reactive({
            loading:false,
        });
        watch([
            toRef(props,'dataInfo'),
        ],()=>{
            return;
            let dataInfo = props.dataInfo.data || []; 
        },{
            immediate:true,
        });
        return { 
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="box-cp-container">
        <div class="container">

        </div>
    </div>
</template>

<style lang="scss" scoped>
.box-cp-container{
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    >.container{
        background-color: rgba(255, 0, 0, 0.442);
        width: 100%;
        height: 100%;
    }
}
</style>
