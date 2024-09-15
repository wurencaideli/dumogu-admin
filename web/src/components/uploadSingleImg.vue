<script>
/**
 * 图片上传组件
 * 只负责上传单个组件
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
import axios from 'axios';
import {
    chooseFile,
    getMime,
    getMimeExtension,
    getSuffix,
    formatFileSize,
} from '@/common/fileSelectTools';
import { messageSuccess, messageError } from '@/action/messagePrompt';
import SvgIcon from '@/components/svgIcon/index.vue';

export default defineComponent({
    name: 'UploadSingleImg',
    components: {
        SvgIcon,
    },
    props: {
        uploadApi: {
            type: String,
            default: '',
        },
        imgUrl: {
            type: String,
            default: '',
        },
        /** 是否显示取消按钮 */
        showCancelBt: {
            type: Boolean,
            default: true,
        },
        showChooseBt: {
            type: Boolean,
            default: true,
        },
        /** 是否自动上传，如果不是自动上传的话file文件由外部指定，并且上传方法由外部调用 */
        autoUpload: {
            type: Boolean,
            default: true,
        },
        maxSize: {
            type: Number,
            default: 0,
        },
        minSize: {
            type: Number,
            default: 0,
        },
        needAccept: {
            type: String,
            default: '',
        },
        accept: {
            type: String,
            default: '',
        },
    },
    emits: ['onChange', 'onSuccess', 'onFail', 'onCancel', 'onChoose'],
    setup(props, { emit }) {
        const dataContainer = reactive({
            imgUrl: toRef(props, 'imgUrl'), //所显示的图片链接
            showCancelBt: toRef(props, 'showCancelBt'),
            showChooseBt: toRef(props, 'showChooseBt'),
            uploadApi: toRef(props, 'uploadApi'),
            autoUpload: toRef(props, 'autoUpload'),
            maxSize: toRef(props, 'maxSize'),
            minSize: toRef(props, 'minSize'),
            needAccept: toRef(props, 'needAccept'),
            accept: toRef(props, 'accept'),
            percentCompleted: '', //上传进度
            status: '',
        });
        const otherDataContainer = {
            file: null,
        };
        /** 验证文件 */
        function verifyFile(file) {
            let maxSize = dataContainer.maxSize; //最大大小
            let minSize = dataContainer.minSize; //最小大小
            let needAccept = dataContainer.needAccept; //文件限制
            let type = getSuffix(file.name); //获取文件后缀类型
            let mimeType = file.type || getMime(file.name) || '';
            let mimeExtension = getMimeExtension(mimeType);
            let size = file.size;
            /** 验证文件合法性 */
            if (
                !needAccept.includes(mimeType) &&
                !needAccept.includes(mimeExtension) &&
                !needAccept.includes(type)
            ) {
                messageError(`文件类型${mimeType}不正确，正确类型:${needAccept}`);
                return false;
            }
            if (size > maxSize || size < minSize) {
                messageError(
                    `文件大小${formatFileSize(size)}超出范围：${formatFileSize(
                        minSize,
                    )} - ${formatFileSize(maxSize)}之间。`,
                );
                return false;
            }
            return true;
        }
        /**
         * 选择文件
         */
        function handleChooseFile() {
            /** 如果配置了自动上传则在文件选择后直接上传 */
            if (dataContainer.autoUpload) {
                return chooseFile({
                    multiple: false,
                    accept: dataContainer.accept,
                })
                    .then((file) => {
                        /** 首先验证文件 */
                        if (!verifyFile(file)) return;
                        otherDataContainer.file = file;
                        /** 向外部抛出 */
                        emit('onChange', file);
                        handleUpload();
                    })
                    .catch(() => {
                        return;
                    });
            } else {
                /** 向外部抛出 */
                emit('onChoose');
            }
        }
        /**
         * 文件上传操作
         * 可由外部调用，外部调用可以直接使用promise的形式
         *  */
        let cancelSource;
        function handleUpload(file) {
            return new Promise((r, j) => {
                /** 如果设置的是手动上传，则file文件由外部指定 */
                if (!dataContainer.autoUpload) {
                    otherDataContainer.file = file;
                }
                if (!otherDataContainer.file) {
                    return;
                }
                /** 如果还有任务的话取消 */
                if (cancelSource) {
                    cancelSource.cancel();
                }
                dataContainer.status = '';
                dataContainer.percentCompleted = '';
                const formData = new FormData();
                formData.append('file', otherDataContainer.file);
                const CancelToken = axios.CancelToken;
                cancelSource = CancelToken.source(); // 创建一个新的CancelToken的源。
                const config = {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        dataContainer.percentCompleted = percentCompleted;
                    },
                    cancelToken: cancelSource.token, // 将源与请求关联起来。
                };
                axios
                    .post(dataContainer.uploadApi, formData, config) // 使用axios发送POST请求进行文件上传，并传递配置对象包含onUploadProgress处理程序。
                    .then((response) => {
                        // 上传成功处理程序
                        /** 向外部抛出 */
                        emit('onSuccess', response);
                        r(response);
                    })
                    .catch((error) => {
                        // 上传失败处理程序
                        j(error);
                        dataContainer.percentCompleted = 0;
                        if (axios.isCancel(error)) {
                            return;
                        }
                        dataContainer.status = 'fail';
                        /** 向外部抛出 */
                        emit('onFail', error);
                    });
            });
        }
        /**
         * 取消上传
         */
        function handleCancel() {
            otherDataContainer.file = '';
            dataContainer.percentCompleted = 0;
            dataContainer.status = '';
            /** 向外部抛出 */
            emit('onCancel');
            if (!cancelSource) return;
            cancelSource.cancel();
        }
        return {
            dataContainer,
            handleUpload,
            handleCancel,
            handleChooseFile,
        };
    },
});
</script>

<template>
    <div class="upload-img-container">
        <img v-if="!!dataContainer.imgUrl" :src="dataContainer.imgUrl" alt="" />
        <div class="progress">
            <div
                v-if="!!dataContainer.percentCompleted"
                :style="{
                    width: `${dataContainer.percentCompleted || 0}%`,
                }"
                class="container"
            >
                <div>{{ dataContainer.percentCompleted || 0 }}%</div>
            </div>
            <div
                v-if="dataContainer.status == 'fail'"
                :style="{
                    width: `100%`,
                }"
                class="container fail-container"
            >
                <div>失败</div>
            </div>
        </div>
        <div
            v-if="dataContainer.showChooseBt"
            @click="handleChooseFile"
            :class="{
                'choose-bt': true,
                show: !dataContainer.imgUrl,
            }"
        >
            <SvgIcon
                :style="'width: 25px;min-width:25px;height: 25px;'"
                name="svg:upload.svg"
            ></SvgIcon>
        </div>
        <div @click="handleCancel" v-if="dataContainer.showCancelBt" class="cancel-bt">
            <SvgIcon
                :style="'width: 15px;min-width:15px;height: 15px;'"
                name="svg:times.svg"
            ></SvgIcon>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.upload-img-container {
    width: auto;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgb(218, 218, 218);
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    &:hover {
        > .cancel-bt,
        > .choose-bt {
            opacity: 1;
        }
    }
    > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }
    > .cancel-bt {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.285);
        border-radius: 5px;
        position: absolute;
        top: 5px;
        right: 5px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 23px;
        height: 23px;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.299);
        opacity: 0;
        transition: all 0.2s;
    }
    > .choose-bt {
        position: absolute;
        cursor: pointer;
        background-color: white;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        box-shadow: 2px 5px 8px rgba(60, 64, 67, 0.15), 0px 2px 2px rgba(60, 64, 67, 0.3);
        opacity: 0;
        transition: all 0.2s;
        /** 强制显示 */
        &.show {
            opacity: 1;
        }
    }
    > .progress {
        position: absolute;
        bottom: 3px;
        left: 0;
        pointer-events: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
        width: 100%;
        > .container {
            min-width: 30%;
            height: 10px;
            border-radius: 999px;
            font-size: 12px;
            background-color: rgb(0, 106, 255);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 0 0;
            box-sizing: border-box;
            box-shadow: 2px 5px 8px rgba(60, 64, 67, 0.15), 0px 2px 2px rgba(60, 64, 67, 0.3);
            > div {
                transform: scale(0.5);
                width: auto;
            }
        }
        > .fail-container {
            background-color: rgb(255, 0, 43);
            margin-top: 5px;
        }
    }
}
</style>
