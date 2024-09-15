<template>
    <el-dialog
        :title="configData.title + configData.afterTitle"
        v-model="configData.open"
        width="600px"
        :close-on-click-modal="false"
        append-to-body
        destroy-on-close
        @close="handleClose"
        class="edit-data-dialog"
    >
        <div class="dialog-container">
            <el-button type="primary" @click="handleChooseFile">
                点击选择本地图片（大小1K - 7M）
            </el-button>
            <div class="container">
                <div class="left">
                    <CropperImg @onCrop="handleCrop" ref="CropperImgRef"></CropperImg>
                </div>
                <div class="right">
                    <img class="img" :src="dataContainer.imgUrl_1" alt="" />
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button
                    @click="
                        () => {
                            dataContainer.closeType = 'cancel';
                            configData.open = false;
                        }
                    "
                >
                    取消
                </el-button>
                <el-button v-if="!configData.isShow" type="primary" @click="handleSubmit">
                    确定选择
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
/**
 * 数据编辑对话框
 * 使用外部调用的方式向内部传递数据
 * 使用promise的形式向外部通知状态
 */
import { defineComponent, ref, getCurrentInstance, reactive, nextTick } from 'vue';
import { mergeObjProperty } from '@/common/otherTools';
import { getDictItem, initDataByConfig } from '@/common/otherTools';
import { verifiedData } from '@/common/verifiedTools';
import { messageError, messageSuccess } from '@/action/messagePrompt.js';
import CropperImg from '@/components/cropperImg.vue';
import {
    chooseFile,
    getMime,
    getMimeExtension,
    getSuffix,
    formatFileSize,
    base64ToFile,
} from '@/common/fileSelectTools';
//配置信息，初始化时使用
const configMap = {
    open: {
        default: false,
    },
    title: {
        default: '头像选择裁剪',
    },
    afterTitle: {
        default: '',
    },
    isShow: {
        //是否只是展示
        default: false,
    },
};

export default defineComponent({
    name: 'EditDataDialog',
    components: {
        CropperImg,
    },
    setup() {
        const CropperImgRef = ref(null);
        const configData = reactive({});
        const dataContainer = reactive({
            loading: false,
            closeType: 'close', //关闭时的类型，是由确认取消按钮关闭的还是其他地方关闭的 confirm cancel
            resolve: undefined, //返给外部promise的回调
            reject: undefined,
            imgUrl_1: '',
        });
        const otherDataContainer = {
            castParams: {}, //向外部传递的参数
        };
        initDataByConfig(configData, {}, configMap);
        /**
         * 对话框关闭时的回调
         * 根据行为类型来判断调用那个回调函数
         *  */
        function handleClose() {
            if (dataContainer.closeType == 'confirm') {
                dataContainer.resolve(otherDataContainer.castParams);
            } else {
                dataContainer.reject(dataContainer.closeType, otherDataContainer.castParams);
            }
        }
        /**
         * 初始化数据（外部调用）
         * 返回一个promise，以提供直接的回调
         *  */
        function initData(show = true, data = {}, option = {}) {
            initDataByConfig(configData, option, configMap);
            dataContainer.closeType = 'close';
            dataContainer.loading = false;
            dataContainer.imgUrl_1 = '';
            otherDataContainer.castParams = {};
            configData.open = show;
            nextTick(() => {
                /** 初始化容器 */
                if (!CropperImgRef.value) return;
                CropperImgRef.value.initData({
                    imgUrl: data.url,
                });
            });
            return new Promise((r, j) => {
                dataContainer.resolve = r;
                dataContainer.reject = j;
            });
        }
        /** 提交数据 */
        function handleSubmit() {
            /** 使用组件自带方法验证数据 */
            otherDataContainer.castParams = {
                url: dataContainer.imgUrl_1,
                file: dataContainer.imgUrl_1
                    ? base64ToFile(dataContainer.imgUrl_1, 'img.png')
                    : null,
            };
            dataContainer.closeType = 'confirm';
            configData.open = false;
        }
        /** 绘制 */
        function handleCrop(res) {
            res = res || {};
            let canvas = res.canvas;
            if (!canvas) return;
            dataContainer.imgUrl_1 = canvas.toDataURL('image/jpeg');
        }
        let maxSize = 1024 * 1024 * 7; //最大大小
        let minSize = 1024 * 1; //最小大小
        let needMimeType = 'image/png,image/jpeg'; //文件限制
        function handleChooseFile() {
            chooseFile({
                multiple: false,
                accept: 'image/png,image/jpeg',
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
        return {
            configData,
            initData,
            dataContainer,
            handleClose,
            handleSubmit,
            handleChooseFile,
            CropperImgRef,
            handleCrop,
        };
    },
});
</script>

<style lang="scss" scoped>
.edit-data-dialog {
    .dialog-container {
        padding: 15px 15px 0 15px;
        box-sizing: border-box;
        > * {
            margin-bottom: 15px;
        }
        > .container {
            display: flex;
            flex-direction: row;
            height: 300px;
            > .left {
                flex: 1 1 0;
                width: 0;
                margin-right: 15px;
                height: 100%;
                border-radius: 5px;
                overflow: hidden;
            }
            > .right {
                width: 150px;
                height: 150px;
                > .img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 5px;
                    overflow: hidden;
                }
            }
        }
    }
}
</style>
