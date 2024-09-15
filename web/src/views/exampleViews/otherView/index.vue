<template>
    <DefinScrollbar height="100%" :showUpBt="true">
        <div class="page-container other-view">
            <p>天气插件，使用iframe的形式（推荐）</p>
            <iframe
                srcdoc='
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>文档标题</title>
                    <style>
                        #he-plugin-standard{
                            width: 100vw !important;
                            height: 100vh !important;
                        }
                        body{
                            margin:0;
                        }
                    </style>
                </head>
                <body>
                    <div id="he-plugin-standard"></div>
                    <script>
                        WIDGET = {
                        "CONFIG": {
                            "layout": "1",
                            "width": "450",
                            "height": "150",
                            "background": "1",
                            "dataColor": "FFFFFF",
                            "key": "ceef05b95bbf49738dfdcd99abef4495"
                        }
                        }
                    </script>
                    <script src="https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0"></script>
                </body>
                </html>'
            >
            </iframe>
            <p>天气插件，使用脚本加载的形式，会与页面中的高德地图起冲突</p>
            <div id="he-plugin-standard"></div>
            <div class="bt-list">
                <p>文档生成以及自定义打印操作</p>
                <el-button type="primary" @click="handleClick"> 生成DOC </el-button>
                <el-button type="primary" @click="handleClick_1"> 自定义打印 </el-button>
            </div>
            <p>展示shadow-dom</p>
            <div class="shadow-container">
                <ShadowHtml
                    :htmlValue="dataContainer.htmlValue"
                    :cssValue="dataContainer.cssValue"
                ></ShadowHtml>
            </div>
            <p>tab切换</p>
            <div class="tab-container">
                <MyTabs class="my-tabs" :activeIndex="dataContainer.activeIndex" :tabLength="5">
                    <div
                        v-for="(item, index) in 5"
                        :key="index"
                        @click="dataContainer.activeIndex = index"
                        class="item"
                    >
                        item{{ index }}
                    </div>
                </MyTabs>
            </div>
            <p>文件选择，可选择图片文件进行裁剪</p>
            <div>
                <el-button type="primary" @click="handleChooseFile"> 点击选择 </el-button>
            </div>
            <p>图片裁剪</p>
            <div class="cropper-img-container">
                <CropperImg @onCrop="handleCrop" ref="CropperImgRef"></CropperImg>
            </div>
            <div class="cropper-img-container">
                <img class="img" :src="dataContainer.imgUrl_1" alt="" />
            </div>
            <p>头像图片上传，可有外部指定文件手动上传</p>
            <div>
                <div style="width: 150px; height: 150px">
                    <UploadSingleImg
                        :imgUrl="dataContainer.imgUrl_3"
                        :showCancelBt="!!dataContainer.imgUrl_3"
                        :maxSize="1024 * 1024 * 7"
                        :minSize="1024 * 7"
                        :needAccept="'image/png,image/jpeg'"
                        :autoUpload="true"
                        :uploadApi="'/upload-api/upload'"
                        @onChange="handleUploadChange"
                        @onSuccess="handleUploadSuccess"
                        @onFail="handleUploadFail"
                        @onCancel="handleUploadCancel"
                    ></UploadSingleImg>
                </div>
            </div>
        </div>
    </DefinScrollbar>
</template>

<script>
import {
    defineComponent,
    ref,
    toRef,
    reactive,
    watch,
    nextTick,
    onUnmounted,
    onMounted,
} from 'vue';
import { createDoc } from './generateDocx/index';
import { table_0 } from './printTemp/template';
import { handlePrint } from './printTemp/base';
import ShadowHtml from '@/components/shadowHtml.vue';
import MyTabs from '@/components/myTabs.vue';
import CropperImg from '@/components/cropperImg.vue';
import UploadSingleImg from '@/components/uploadSingleImg.vue';
import {
    chooseFile,
    getMime,
    getMimeExtension,
    getSuffix,
    formatFileSize,
} from '@/common/fileSelectTools';
import { messageSuccess, messageError } from '@/action/messagePrompt';

export default defineComponent({
    components: {
        ShadowHtml,
        MyTabs,
        CropperImg,
        UploadSingleImg,
    },
    setup() {
        const CropperImgRef = ref(null);
        const dataContainer = reactive({
            htmlValue: '<p>展示一个红色字体的p标签，且不影响系统其他样式</p>',
            cssValue: 'p{color:red;}',
            activeIndex: 0,
            imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            imgUrl_1: '',
            imgUrl_3: '',
        });
        const otherContainer = {};
        /** 加载天气脚本 */
        function loadWeatherWidget() {
            // 创建一个新的 <script> 元素用于配置 WIDGET 对象
            var widgetConfigScript = document.createElement('script');
            // 设置脚本的内容为 WIDGET 对象的配置信息
            widgetConfigScript.innerHTML =
                'WIDGET = {\n' +
                '  "CONFIG": {\n' +
                '    "layout": "1",\n' +
                '    "width": "450",\n' +
                '    "height": "150",\n' +
                '    "background": "1",\n' +
                '    "dataColor": "FFFFFF",\n' +
                '    "key": "00484b70a8cb4791a05a277c7774b177"\n' +
                '  }\n' +
                '}';
            // 将配置脚本附加到文档的 <head> 元素中
            document.head.appendChild(widgetConfigScript);
            // 创建一个新的 <script> 元素用于加载天气小部件脚本
            var widgetScript = document.createElement('script');
            // 设置脚本的 src 属性，即天气小部件脚本的 URL
            widgetScript.src =
                'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0';
            // 将天气小部件脚本附加到文档的 <body> 元素中，这将触发脚本的加载和执行
            document.body.appendChild(widgetScript);
        }
        onMounted(() => {
            /**
             * 使用脚本加载
             * 此方式使用的话如果页面中有使用高德地图的话会有冲突，因为该天气组件也使用了高德地图
             * 所有使用iframe会更好点
             *  */
            loadWeatherWidget();
            /**
             * 初始化图片裁剪
             */
            initData();
        });
        /** 获取字符串的可视宽度 */
        function getVisibleWidth(str) {
            let font = '12px Microsoft YaHei';
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = font;
            const metrics = context.measureText(str);
            return metrics.width;
        }
        /** 截取到指定长度 */
        function truncateStringToWidth(str, maxWidth) {
            let truncatedStr = str;
            while (getVisibleWidth(truncatedStr) > maxWidth && truncatedStr.length > 0) {
                truncatedStr = truncatedStr.slice(0, -1);
            }
            return truncatedStr;
        }
        /** 生成模板 */
        function handleClick() {
            let imgUrl = generateAndDownloadImage();
            createDoc({
                imgUrl: imgUrl,
                form: {
                    name: '哈哈哈',
                },
            });
        }
        /** 打印模板 */
        function handleClick_1() {
            let html = table_0.render({
                list: [{}],
            });
            handlePrint({
                html: `
                    ${html}
                `,
                css: table_0.css,
            });
        }
        /** 创建一张图片用作生成doc文件 */
        function generateAndDownloadImage() {
            // 创建一个Canvas元素
            var canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 200;
            // 获取Canvas上下文
            var context = canvas.getContext('2d');
            // 在Canvas上绘制文本
            context.font = '30px Arial';
            context.fillText('Hello, World!', 50, 50);
            // 获取Canvas上的图像数据
            var imageData = canvas.toDataURL('image/png');
            return imageData;
        }
        function initData() {
            if (!CropperImgRef.value) return;
            CropperImgRef.value.initData({
                imgUrl: dataContainer.imgUrl,
            });
        }
        /** 绘制 */
        function handleCrop(res) {
            res = res || {};
            let canvas = res.canvas;
            if (!canvas) return;
            dataContainer.imgUrl_1 = canvas.toDataURL('image/jpeg');
        }
        let maxSize = 1024 * 1024 * 7; //最大大小
        let minSize = 1024 * 0; //最小大小
        let needMimeType = 'image/png,image/jpeg,.txt'; //文件限制
        function handleChooseFile() {
            chooseFile({
                multiple: false,
                accept: '*',
            })
                .then((file) => {
                    let type = getSuffix(file.name); //获取文件后缀类型
                    let mimeType = file.type || getMime(file.name) || '';
                    let mimeExtension = getMimeExtension(mimeType);
                    let size = file.size;
                    /** 验证文件合法性 */
                    if (
                        !needMimeType.includes(mimeType) &&
                        !needMimeType.includes(mimeExtension) &&
                        !needMimeType.includes(type)
                    ) {
                        messageError(`文件类型${mimeType}不正确，正确类型:${needMimeType}`);
                        return;
                    }
                    if (size > maxSize || size < minSize) {
                        messageError(
                            `文件大小${formatFileSize(size)}超出范围：${formatFileSize(
                                minSize,
                            )} - ${formatFileSize(maxSize)}之间。`,
                        );
                        return;
                    }
                    messageSuccess(`已选文件:${file.name}`);
                    /** 渲染进入裁剪区域 */
                    if (!CropperImgRef.value) return;
                    CropperImgRef.value.initData({
                        imgUrl: URL.createObjectURL(file),
                    });
                })
                .catch(() => {
                    return;
                });
        }
        /** 上传组件选择事件 */
        function handleUploadChange(file) {
            if (!file) return;
            dataContainer.imgUrl_3 = URL.createObjectURL(file);
        }
        /** 上传组件成功事件 */
        function handleUploadSuccess() {
            messageSuccess(`文件上传成功`);
        }
        /** 上传组件失败事件 */
        function handleUploadFail() {
            messageError(`文件上传失败`);
        }
        /** 上传组件取消事件 */
        function handleUploadCancel() {
            messageSuccess(`文件上传已取消`);
            dataContainer.imgUrl_3 = '';
        }
        return {
            dataContainer,
            handleClick,
            handleClick_1,
            handleCrop,
            CropperImgRef,
            handleChooseFile,
            handleUploadChange,
            handleUploadSuccess,
            handleUploadFail,
            handleUploadCancel,
        };
    },
});
</script>

<style lang="scss" scoped>
.other-view {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px;
    box-sizing: border-box;
    > * {
        margin: 0 0 15px 0;
        &:last-child {
            margin: 0;
        }
    }
    > iframe {
        width: 500px;
        height: 200px;
        border: none;
    }
    :deep(#he-plugin-standard) {
        width: 500px !important;
        height: 200px !important;
        margin: 0 0 15px 0 !important;
        border: none;
    }
    > .bt-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        > * {
            margin: 0 15px 0 0;
            &:last-child {
                margin: 0;
            }
        }
    }
    > .shadow-container {
        background-color: rgb(231, 231, 231);
        padding: 15px;
        box-sizing: border-box;
        border-radius: 5px;
    }
    > .tab-container {
        :deep(.my-tabs) {
            --my-tabs-padding: 15px;
            --my-tabs-border-radius: 5px;
            background-color: rgb(233, 233, 233);
            > .item {
                padding: 15px;
                box-sizing: border-box;
                cursor: pointer;
            }
            > .my-tabs-active-item-bg {
                background-color: #0084ff24;
            }
        }
    }
    .cropper-img-container {
        width: 400px;
        max-width: 400px;
        height: 400px;
        overflow: hidden;
        > .img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
        }
    }
}
</style>
