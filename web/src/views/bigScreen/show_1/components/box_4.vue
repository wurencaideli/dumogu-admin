<script>
/**
 * 盒子
 *  */
import {
    defineComponent,
    ref,
    getCurrentInstance,
    reactive,
    toRef,
    computed,
    onMounted,
    onActivated,
    watch,
} from 'vue';
import EchartContainer from '@/components/echartContainer.vue';
import * as echarts from 'echarts';

export default defineComponent({
    components: {
        EchartContainer,
    },
    props: {
        dataInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    setup(props) {
        const EchartContainerRef = ref(); //组件实例
        const dataContainer = reactive({
            loading: false,
        });
        watch(
            [toRef(props, 'dataInfo')],
            () => {
                return;
                let dataInfo = props.dataInfo.data || [];
            },
            {
                immediate: true,
            },
        );
        onMounted(() => {
            if (!EchartContainerRef.value) return;
            let option = {
                tooltip: {},
                grid: {
                    top: '20%',
                    left: '2%',
                    right: '2%',
                    bottom: '5%',
                    containLabel: true,
                },
                legend: {
                    itemGap: 50,
                    data: ['注册总量', '最新注册量'],
                    textStyle: {
                        color: '#f9f9f9',
                        borderColor: '#fff',
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        axisLine: {
                            //坐标轴轴线相关设置。数学上的x轴
                            show: true,
                            lineStyle: {
                                color: '#f9f9f9',
                            },
                        },
                        axisLabel: {
                            //坐标轴刻度标签的相关设置
                            textStyle: {
                                color: '#d1e6eb',
                                margin: 15,
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        // max: 140,
                        splitNumber: 7,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#0a3256',
                            },
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            margin: 20,
                            textStyle: {
                                color: '#d1e6eb',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                    },
                ],
                series: [
                    {
                        name: '注册总量',
                        type: 'line',
                        // smooth: true, //是否平滑曲线显示
                        // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 3,
                        lineStyle: {
                            normal: {
                                color: '#28ffb3', // 线条颜色
                            },
                            borderColor: '#f0f',
                        },
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#fff',
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: '#28ffb3',
                            },
                        },
                        tooltip: {
                            show: false,
                        },
                        areaStyle: {
                            //区域填充样式
                            normal: {
                                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(0,154,120,1)',
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(0,0,0, 0)',
                                        },
                                    ],
                                    false,
                                ),
                                shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                            },
                        },
                        data: [393, 438, 485, 631, 689, 824, 987],
                    },
                    {
                        name: '最新注册量',
                        type: 'bar',
                        barWidth: 10,
                        tooltip: {
                            show: false,
                        },
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#fff',
                            },
                        },
                        itemStyle: {
                            normal: {
                                // barBorderRadius: 5,
                                // color: new echarts.graphic.LinearGradient(
                                //     0, 0, 0, 1,
                                //     [{
                                //             offset: 0,
                                //             color: '#14c8d4'
                                //         },
                                //         {
                                //             offset: 1,
                                //             color: '#43eec6'
                                //         }
                                //     ]
                                // )
                                color: function (params) {
                                    var colorList = [
                                        '#0ec1ff',
                                        '#10cdff',
                                        '#12daff',
                                        '#15ebff',
                                        '#17f8ff',
                                        '#1cfffb',
                                        '#1dfff1',
                                    ];
                                    return colorList[params.dataIndex];
                                },
                            },
                        },
                        data: [200, 382, 102, 267, 186, 315, 316],
                    },
                ],
            };
            /** 初始化图表 */
            EchartContainerRef.value.initData(option);
        });
        return {
            dataContainer,
            EchartContainerRef,
        };
    },
});
</script>

<template>
    <div class="box-cp-container">
        <EchartContainer ref="EchartContainerRef"></EchartContainer>
    </div>
</template>

<style lang="scss" scoped>
.box-cp-container {
    width: 100%;
    height: 100%;
}
</style>
