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
            使用rem进行大小切换，保持宽高比例使其可全部展现在可视区域。（强烈推荐）
            懒得手动转换的可以试试 npm run to-rem 命令使用脚本替换，方便。
            其中执行的js文件在根目录下的automationScripts文件夹中，可以选择替换。
            <p>
                contain : 被替换的内容将被缩放，以在填充元素的内容框时保持其宽高比。使内容全部可见。
                cover : 被替换的内容在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框。
            </p>
            <a 
                style="color: inherit;background-color: #0039ff;padding: 0px 10px;border-radius: 5px;"
                href="https://github.com/wurencaideli/dumogu-admin/blob/master/web/src/views/bigScreen/show_4/index.vue" 
                target="_blank" rel="noopener noreferrer">
                源码地址
            </a>
            <router-link
                style="color: inherit;background-color: #0039ff;padding: 0px 10px;border-radius: 5px;"
                to="/big-screen/show_4?fit=cover">
                cover缩放模式
            </router-link>
            <router-link
                style="color: inherit;background-color: #0039ff;padding: 0px 10px;border-radius: 5px;"
                to="/big-screen/show_4?fit=contain">
                contain缩放模式
            </router-link>
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
        background-color: rgba(0, 128, 255, 0.313);
        width: 100%;
        height: 100%;
        font-size: 1.250rem;
        color: white;
        padding: 0.938rem;
        box-sizing: border-box;
        border-radius: 0.5rem;
        >*{
            margin: 0 15px 0 0;
            line-height: 1.2;
            &:last-child{
                margin: 0;
            }
        }
    }
}
</style>
