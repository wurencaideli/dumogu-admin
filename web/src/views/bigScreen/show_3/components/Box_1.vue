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
            宽高固定，可视区域宽高不匹配会导致裁剪
            <a 
                style="color: inherit;background-color: #0039ff;padding: 5px 10px;border-radius: 5px;"
                href="https://github.com/wurencaideli/dumogu-admin/blob/master/web/src/views/bigScreen/show_3/index.vue" 
                target="_blank" rel="noopener noreferrer">
                源码地址
            </a>
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
        font-size: 1.250rem;
        color: white;
        padding: 0.938rem;
        box-sizing: border-box;
    }
}
</style>
