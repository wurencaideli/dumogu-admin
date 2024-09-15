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
            var option = {
                title: {
                    text: '',
                },
                tooltip: {},
                legend: {
                    top: 20,
                    itemWidth: 12,
                    itemHeight: 12,
                    data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'],
                    textStyle: {
                        color: '#fff',
                    },
                },
                radar: {
                    radius: '60%',
                    splitNumber: 8,
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            opacity: 0.2,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#fff',
                            opacity: 0.2,
                        },
                    },
                    splitArea: {
                        areaStyle: {
                            color: 'rgba(127,95,132,.3)',
                            opacity: 1,
                            shadowBlur: 45,
                            shadowColor: 'rgba(0,0,0,.5)',
                            shadowOffsetX: 0,
                            shadowOffsetY: 15,
                        },
                    },
                    indicator: [
                        {
                            name: 'Sales',
                            max: 6000,
                        },
                        {
                            name: 'Administration',
                            max: 16000,
                        },
                        {
                            name: 'Information Techology',
                            max: 30000,
                        },
                        {
                            name: 'Customer Support',
                            max: 35000,
                        },
                        {
                            name: 'Development',
                            max: 50000,
                        },
                        {
                            name: 'Marketing',
                            max: 25000,
                        },
                    ],
                },
                series: [
                    {
                        name: '预算 vs 开销（Budget vs spending）',
                        type: 'radar',
                        symbolSize: 0,
                        areaStyle: {
                            normal: {
                                shadowBlur: 13,
                                shadowColor: 'rgba(0,0,0,.2)',
                                shadowOffsetX: 0,
                                shadowOffsetY: 10,
                                opacity: 1,
                            },
                        },
                        data: [
                            {
                                value: [5000, 7000, 12000, 11000, 15000, 14000],
                                name: '预算分配（Allocated Budget）',
                            },
                            {
                                value: [2500, 12000, 8000, 8500, 12000, 12000],
                                name: '实际开销（Actual Spending）',
                            },
                        ],
                    },
                ],
                color: ['#ef4b4c', '#b1eadb'],
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
