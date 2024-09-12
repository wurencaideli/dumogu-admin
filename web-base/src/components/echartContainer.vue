<script>
/**
 * echart容器
 * 外部只关心写入配置
 * 组件关心的是自身大小的适应以及实例的销毁，以及提供一些常用的方法让外部调用
 */
import {
    defineComponent,
    ref,
    getCurrentInstance,
    reactive,
    nextTick,
    computed,
    onUnmounted,
    onActivated,
    onMounted,
} from 'vue';
import * as echarts from 'echarts';

export default defineComponent({
    name: 'EchartContainer',
    setup() {
        const ChartRef = ref(null);
        const ChartCpRef = ref(null);
        const otherContainer = {
            optionData: {},
            myChart: '',
        };
        /**
         * 初始化数据（外部调用）
         * 外部只关心图标的option数据，写入就行
         *  */
        function initData(data) {
            otherContainer.optionData = data;
            initChart();
        }
        /** 重新计算图表大小 */
        function resizeChart() {
            if (otherContainer.myChart) {
                otherContainer.myChart.resize();
            }
        }
        /** 当元素大小发生变化时 */
        if (typeof ResizeObserver === 'function') {
            let resizeObserver = new ResizeObserver(() => {
                if (!ChartCpRef.value) return;
                resizeChart();
            });
            onMounted(() => {
                resizeObserver.observe(ChartCpRef.value);
            });
        }
        /** 当屏幕缩放时 */
        window.addEventListener('resize', resizeChart);
        onUnmounted(() => {
            window.removeEventListener('resize', resizeChart);
            disposeChart();
        });
        onActivated(() => {
            resizeChart();
        });
        /** 初始化图表 */
        function initChart() {
            if (otherContainer.myChart) {
                // 使用之前的图表
                otherContainer.myChart.setOption(otherContainer.optionData);
                otherContainer.myChart.resize();
            } else {
                otherContainer.myChart = echarts.init(ChartRef.value, null, {
                    renderer: 'svg',
                });
                otherContainer.myChart.setOption(otherContainer.optionData, true);
            }
        }
        /**
         * 销毁图表  (外部可调用)
         *  */
        function disposeChart() {
            /** 销毁元素 */
            if (otherContainer.myChart) {
                otherContainer.myChart.dispose();
                otherContainer.myChart = '';
            }
        }
        return {
            ChartRef,
            initData,
            disposeChart,
            ChartCpRef,
        };
    },
});
</script>

<template>
    <div ref="ChartCpRef" class="chart-cp-container">
        <div class="chart" ref="ChartRef"></div>
    </div>
</template>

<style lang="scss" scoped>
.chart-cp-container {
    width: 100%;
    height: 100%;
    > .chart {
        width: 100%;
        height: 100%;
    }
}
</style>
