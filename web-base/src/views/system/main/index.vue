<script>
/**
 * 页面例子
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
    onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import EchartContainer from '@/components/echartContainer.vue';
import DefinScrollbar from '@/components/definScrollbar.vue';
import * as echarts from 'echarts';

export default defineComponent({
    components: {
        SvgIcon,
        EchartContainer,
        DefinScrollbar,
    },
    setup() {
        const router = useRouter();
        const EchartContainerRef_2 = ref(); //组件实例
        const dataContainer = reactive({
            name: import.meta.env.VITE_APP_name,
            loading: false,
        });
        onMounted(() => {
            EchartContainerRef_2.value.initData({
                backgroundColor: '',
                title: {
                    text: '政策补贴额度',
                    x: 'left',
                    textStyle: { fontSize: '15', color: '#000000' },
                },
                grid: { top: 70, right: 20, bottom: 30, left: 30 },
                tooltip: { trigger: 'axis' },
                legend: { data: ['预购队列', '最新成交价'], right: 0 },
                xAxis: {
                    data: [
                        '1月',
                        '2月',
                        '3月',
                        '4月',
                        '5月',
                        '6月',
                        '7月',
                        '8月',
                        '9月',
                        '10月',
                        '11月',
                        '12月',
                    ],
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '价格',
                        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
                    },
                ],
                series: [
                    {
                        name: '预购队列',
                        type: 'line',
                        symbolSize: 6,
                        symbol: 'circle',
                        smooth: true,
                        data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
                        lineStyle: { color: '#fe9a8b' },
                        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#fe9a8bb3' },
                                { offset: 1, color: '#fe9a8b03' },
                            ]),
                        },
                    },
                    {
                        name: '最新成交价',
                        type: 'line',
                        symbolSize: 6,
                        symbol: 'circle',
                        smooth: true,
                        data: [0, 24.1, 7.2, 15.5, 42.4, 42.4, 42.4, 24.1, 7.2, 15.5, 42.4, 0],
                        lineStyle: { color: '#9E87FF' },
                        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#9E87FFb3' },
                                { offset: 1, color: '#9E87FF03' },
                            ]),
                        },
                        emphasis: {
                            itemStyle: {
                                color: {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.5,
                                    colorStops: [
                                        { offset: 0, color: '#9E87FF' },
                                        { offset: 0.4, color: '#9E87FF' },
                                        { offset: 0.5, color: '#fff' },
                                        { offset: 0.7, color: '#fff' },
                                        { offset: 0.8, color: '#fff' },
                                        { offset: 1, color: '#fff' },
                                    ],
                                },
                                borderColor: '#9E87FF',
                                borderWidth: 2,
                            },
                        },
                    },
                ],
            });
        });
        return {
            dataContainer,
            EchartContainerRef_2,
        };
    },
});
</script>

<template>
    <DefinScrollbar height="100%" :showUpBt="true">
        <div class="page-container main-view">
            <div class="container">
                <h3>{{ dataContainer.name }}</h3>
                <p>自定义页面菜单，标签页可自定义是否缓存。</p>
                <p>
                    标签页下面有小横条的表示有缓存，有两种页面列表管理，一种是修改添加会打开新页面，另一种是以对话框形式操作数据。其中对话框已经封装完善。
                </p>
                <div class="echart-container">
                    <div class="bottom-container">
                        <EchartContainer ref="EchartContainerRef_2"></EchartContainer>
                    </div>
                </div>
            </div>
        </div>
    </DefinScrollbar>
</template>

<style lang="scss" scoped>
.main-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    .container {
        width: 100%;
        min-height: 800px;
        border-radius: 5px;
        padding: 15px;
        box-sizing: border-box;
        > * {
            margin: 0 0 30px 0;
            &:last-child {
                margin: 0;
            }
        }
        > .echart-container {
            width: 100%;
            > .top-container {
                display: flex;
                flex-direction: row;
                height: 300px;
                > .left,
                > .right {
                    width: 0;
                    flex: 1 1 0;
                }
                > .left {
                    flex: 2 1 0;
                    margin-right: 60px;
                }
            }
            > .bottom-container {
                width: 100%;
                height: 400px;
                margin-top: 30px;
            }
        }
    }
}
</style>
