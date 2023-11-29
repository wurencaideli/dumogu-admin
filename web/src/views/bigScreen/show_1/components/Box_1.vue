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
            使用transform进行缩放，使容器宽高保持指定比例，并且可展示全。展示不需要交互大屏的最佳选择。
            <a 
                style="color: inherit;background-color: #0039ff;padding: 5px 10px;border-radius: 5px;"
                href="https://github.com/wurencaideli/dumogu-admin/blob/master/web/src/views/bigScreen/show_1/index.vue" 
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
        background-color: rgba(0, 179, 255, 0.442);
        width: 100%;
        height: 100%;
        font-size: 1.250rem;
        color: white;
        padding: 0.938rem;
        box-sizing: border-box;
        border-radius: 10px;
    }
}
</style>
