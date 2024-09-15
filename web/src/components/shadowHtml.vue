<script>
/**
 * 影子dom 展示html组件
 */
import {
    defineComponent,
    ref,
    getCurrentInstance,
    reactive,
    nextTick,
    computed,
    toRef,
    onMounted,
    watch,
} from 'vue';
import { debounceFn } from '@/common/debounceAndThrottle';

export default defineComponent({
    props: {
        htmlValue: {
            type: String,
            default: '',
        },
        cssValue: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const ShadowHtmlRef = ref(null);
        const dataContainer = reactive({
            htmlValue: toRef(props, 'htmlValue'),
            cssValue: toRef(props, 'cssValue'),
        });
        let shadowDom;
        function initData() {
            shadowDom = ShadowHtmlRef.value.attachShadow({ mode: 'closed' });
        }
        onMounted(() => {
            initData();
        });
        /** 开始渲染html */
        const drawHtml = debounceFn(function () {
            let htmlValue = dataContainer.htmlValue;
            let cssValue = dataContainer.cssValue;
            if (!shadowDom) return;
            htmlValue = formateHtml(htmlValue);
            shadowDom.innerHTML = `
                <style>${cssValue || ''}</style>
                ${htmlValue || ''}
            `;
        }, 300);
        /** 格式化html，防止脚本标签 */
        function formateHtml(value) {
            if (!value) return '';
            let reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi; //生成相关正则信息
            value = value.replace(reg, ''); //忽略大小写的正则
            return value;
        }
        watch(props, () => {
            drawHtml();
        });
        drawHtml();
        return {
            ShadowHtmlRef,
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="shadow-html" ref="ShadowHtmlRef"></div>
</template>
