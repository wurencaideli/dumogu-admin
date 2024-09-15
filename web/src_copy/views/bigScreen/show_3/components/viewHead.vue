<script>
/**
 * 页面的头部
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
import img_1 from '../assets/header-bg.png';

export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        bgImg: {
            type: String,
            default: '',
        },
    },
    components: {},
    setup(props) {
        const dataContainer = reactive({
            img: {
                img_1: img_1,
            },
            title: toRef(props, 'title'),
            bgImg: toRef(props, 'bgImg'),
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <div
        :style="{
            '--bg-img': `url(${dataContainer.bgImg || dataContainer.img.img_1})`,
        }"
        class="view-head-cp-container"
    >
        <div class="left">
            <slot name="left"></slot>
        </div>
        <div class="centre">
            {{ dataContainer.title }}
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.view-head-cp-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    box-sizing: border-box;
    background-image: var(--bg-img);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    > .left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
    }
    > .centre {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 42px;
        line-height: 1;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 2px;
        color: #ffffff;
        transform: translateY(-11px);
        font-family: Avenir, sans-serif;
    }
    > .right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
    }
}
</style>
