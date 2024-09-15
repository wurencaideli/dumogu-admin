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

export default defineComponent({
    components: {},
    props: {
        dataInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    setup(props) {
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
            <p>
                contain : 被替换的内容将被缩放，以在填充元素的内容框时保持其宽高比。使内容全部可见。
                cover :
                被替换的内容在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框。
            </p>
            <a
                style="
                    color: inherit;
                    background-color: #0039ff;
                    padding: 0px 10px;
                    border-radius: 5px;
                "
                href="https://github.com/wurencaideli/dumogu-admin/blob/master/web/src/views/bigScreen/show_1/index.vue"
                target="_blank"
                rel="noopener noreferrer"
            >
                源码地址
            </a>
            <router-link
                style="
                    color: inherit;
                    background-color: #0039ff;
                    padding: 0px 10px;
                    border-radius: 5px;
                "
                to="/big-screen/show_1?fit=cover"
            >
                cover缩放模式
            </router-link>
            <router-link
                style="
                    color: inherit;
                    background-color: #0039ff;
                    padding: 0px 10px;
                    border-radius: 5px;
                "
                to="/big-screen/show_1?fit=contain"
            >
                contain缩放模式
            </router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.box-cp-container {
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    > .container {
        background-color: rgba(0, 179, 255, 0.442);
        width: 100%;
        height: 100%;
        font-size: 1.25rem;
        color: white;
        padding: 0.938rem;
        box-sizing: border-box;
        border-radius: 10px;
        > * {
            margin: 0 15px 0 0;
            line-height: 1.2;
            &:last-child {
                margin: 0;
            }
        }
    }
}
</style>
