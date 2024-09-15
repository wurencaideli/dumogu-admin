<script>
/**
 * 头像裁剪组件，由外部传入配置，然后将裁剪数据向外部抛出
 * https://www.npmjs.com/package/cropperjs
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
    nextTick,
} from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default defineComponent({
    name: 'CropperImg',
    emits: ['onCrop'],
    setup(_, { emit }) {
        const ImgRef = ref(null);
        const dataContainer = reactive({
            imgUrl: '',
        });
        const otherDataContainer = {
            imgCanvas: null,
            cropperInstance: null,
        };
        /**
         * 初始化数据
         * 由外部调用，传入配置
         *  */
        function initData(option) {
            option = option || {};
            if (!ImgRef.value) return;
            dataContainer.imgUrl = option.imgUrl;
            /** 如果已经初始化了则销毁 */
            if (otherDataContainer.cropperInstance) {
                otherDataContainer.cropperInstance.destroy();
            }
            nextTick(() => {
                let timer;
                let cropperInstance = new Cropper(ImgRef.value, {
                    aspectRatio: 1 / 1,
                    viewMode: 1, // 设置裁剪框的显示模式
                    ...option,
                    crop(event) {
                        /** 添加防抖，防止卡顿 */
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            otherDataContainer.imgCanvas = cropperInstance.getCroppedCanvas();
                            /** 向外部抛出 */
                            emit('onCrop', {
                                canvas: otherDataContainer.imgCanvas,
                            });
                        }, 30);
                    },
                });
                otherDataContainer.cropperInstance = cropperInstance;
                window.test = cropperInstance;
            });
        }
        return {
            dataContainer,
            ImgRef,
            initData,
        };
    },
});
</script>

<template>
    <div class="cropper-img-cp-container">
        <img class="img" ref="ImgRef" :src="dataContainer.imgUrl" />
    </div>
</template>

<style lang="scss" scoped>
.cropper-img-cp-container {
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: rgb(241, 241, 241);
    > .img {
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        display: block;
        object-fit: contain;
    }
}
</style>
