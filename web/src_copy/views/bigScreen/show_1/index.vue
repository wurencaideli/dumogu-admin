<script>
/**
 * 大屏主页面
 * 采用缩放的形式进行适配，搭配rem的话很方便实用
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
import AutoScalContainer from '@/components/autoScalContainer.vue';
import ViewHead from './components/viewHead.vue';
import img_1 from './assets/bg.png';
import img_2 from './assets/1-1-bg.png';
import Box_1 from './components/box_1.vue';
import Box_2 from './components/box_2.vue';
import Box_3 from './components/box_3.vue';
import Box_4 from './components/box_4.vue';
import Box_5 from './components/box_5.vue';
import Box_6 from './components/box_6.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'BigScreenView',
    components: {
        AutoScalContainer,
        ViewHead,
        Box_1,
        Box_2,
        Box_3,
        Box_4,
        Box_5,
        Box_6,
    },
    setup() {
        let route = useRoute();
        const dataContainer = reactive({
            loading: false,
            img: {
                img_1,
                img_2,
            },
            fit: 'contain',
        });
        watch(
            route,
            () => {
                let queryParams = route.query || {};
                let fitMap = {
                    cover: 'cover',
                    contain: 'contain',
                };
                dataContainer.fit = fitMap[queryParams.fit] || 'contain';
            },
            {
                immediate: true,
            },
        );
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="big-screen-view">
        <AutoScalContainer :height="1080" :width="1920" :fit="dataContainer.fit">
            <div
                class="big-screen-view-container"
                :style="{
                    '--bg-img-1': `url(${dataContainer.img.img_1})`,
                    '--bg-img-2': `url(${dataContainer.img.img_2})`,
                }"
            >
                <div class="head">
                    <ViewHead title="数据可视化大屏展示"></ViewHead>
                </div>
                <div class="content">
                    <div class="top">
                        <Box_1></Box_1>
                    </div>
                    <div class="content">
                        <div class="left">
                            <div class="box">
                                <Box_2></Box_2>
                            </div>
                            <div class="box">
                                <Box_3></Box_3>
                            </div>
                        </div>
                        <div class="right">
                            <div class="box">
                                <Box_4></Box_4>
                            </div>
                            <div class="box">
                                <Box_5></Box_5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="centre-box">
                    <div class="v-height"></div>
                    <div class="container">
                        <Box_6></Box_6>
                    </div>
                </div>
            </div>
        </AutoScalContainer>
    </div>
</template>

<style lang="scss" scoped>
.big-screen-view {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #031045c7;
    .big-screen-view-container {
        width: 1920px;
        height: 1080px;
        background-color: rgb(169, 169, 169);
        display: flex;
        flex-direction: column;
        background-image: var(--bg-img-1);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        position: relative;
        > .head {
            height: 91px;
            position: relative;
            z-index: 2;
        }
        > .content {
            display: flex;
            flex-direction: column;
            flex: 1 1 0;
            width: 100%;
            height: 0;
            position: relative;
            z-index: 2;
            pointer-events: none;
            > .top {
                width: 100%;
                height: 199px;
                pointer-events: initial;
            }
            > .content {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex: 1 1 0;
                width: 100%;
                height: 0;
                padding: 0 15px 15px 15px;
                box-sizing: border-box;
                > .left,
                > .right {
                    display: flex;
                    flex-direction: column;
                    > .box {
                        width: 100%;
                        flex: 1 1 0;
                        height: 0;
                        background-image: var(--bg-img-2);
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        background-position: center;
                        margin: 0 0 15px 0;
                        pointer-events: initial;
                        &:last-child {
                            margin: 0;
                        }
                    }
                }
                > .left {
                    height: 100%;
                    width: 550px;
                }
                > .right {
                    height: 100%;
                    width: 550px;
                }
            }
        }
        > .centre-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            display: flex;
            flex-direction: column;
            > .v-height {
                width: 100%;
                height: 270px;
            }
            > .container {
                flex: 1 1 0;
                height: 0;
                width: 100%;
            }
        }
    }
}
</style>
