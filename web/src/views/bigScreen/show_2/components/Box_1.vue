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
            懒得手动转换的可以试试 npm run to-rem 命令使用脚本替换，方便。
            其中执行的js文件在根目录下的automationScripts文件夹中，可以选择替换。
        </div>
    </div>
</template>

<style lang="scss" scoped>
.box-cp-container{
    width: 100%;
    height: 100%;
    padding: 0.938rem;
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
