<template>
    <DefinScrollbar 
        height="100%">
        <div class="page-container main-view">
            <div class="container">
                <EchartContainer
                    ref="EchartContainerRef"></EchartContainer>
            </div>
        </div>
    </DefinScrollbar>
</template>

<script>
/**
 * 页面例子
 */
import {
    defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated,
    onMounted,
} from 'vue';
import { useRouter } from "vue-router";
import SvgIcon from "@/components/svgIcon/index.vue";
import EchartContainer from "@/components/EchartContainer.vue";
import DefinScrollbar from "@/components/DefinScrollbar.vue";

export default defineComponent({
    components: {
        SvgIcon,
        EchartContainer,
        DefinScrollbar,
    },
    setup() {
        const router = useRouter();
        const EchartContainerRef = ref();  //组件实例
        const dataContainer = reactive({
            loading:false,
            
        });
        onMounted(()=>{
            /** 初始化图表 */
            EchartContainerRef.value.initData({
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '30%']
                },
                visualMap: {
                    type: 'piecewise',
                    show: false,
                    dimension: 0,
                    seriesIndex: 0,
                    pieces: [
                    {
                        gt: 1,
                        lt: 3,
                        color: 'rgba(0, 0, 180, 0.4)'
                    },
                    {
                        gt: 5,
                        lt: 7,
                        color: 'rgba(0, 0, 180, 0.4)'
                    }
                    ]
                },
                series: [
                    {
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    lineStyle: {
                        color: '#5470C6',
                        width: 5
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        label: { show: false },
                        data: [{ xAxis: 1 }, { xAxis: 3 }, { xAxis: 5 }, { xAxis: 7 }]
                    },
                    areaStyle: {},
                    data: [
                        ['2019-10-10', 200],
                        ['2019-10-11', 560],
                        ['2019-10-12', 750],
                        ['2019-10-13', 580],
                        ['2019-10-14', 250],
                        ['2019-10-15', 300],
                        ['2019-10-16', 450],
                        ['2019-10-17', 300],
                        ['2019-10-18', 100]
                    ]
                    }
                ]
            });
        });
        return {
            dataContainer,
            EchartContainerRef,
        };
    },
});
</script>

<style lang="scss" scoped>
    .main-view{
        display: flex;
        flex-direction: column;
        width: 100%;
        .container{
            background-color: white;
            width: 100%;
            height: 800px;
            border-radius: 5px;
        }
    }
</style>
