<template>
    <el-dialog
        :title="configData.title + configData.afterTitle"
        v-model="configData.open"
        width="800px"
        :close-on-click-modal="false"
        append-to-body
        destroy-on-close
        @close="handleClose"
        class="edit-data-dialog"
    >
        <div class="dialog-container">
            <el-form
                :model="dataContainer.form"
                ref="FormElRef"
                :inline="true"
                :rules="dataContainer.rules"
                label-width="100px"
            >
                <el-row :gutter="0">
                    <el-col :span="12" :xs="6">
                        <el-form-item label="角色名称" prop="name">
                            <el-input
                                v-model="dataContainer.form.name"
                                placeholder="请输入"
                                :disabled="configData.isShow"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="角色标识" prop="sign">
                            <el-input
                                v-model="dataContainer.form.sign"
                                placeholder="请输入"
                                :disabled="configData.isShow"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number
                                style="width: 100%"
                                v-model="dataContainer.form.sort"
                                :min="1"
                                :max="999"
                                controls-position="right"
                                :disabled="configData.isShow"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="状态" prop="status">
                            <el-switch
                                v-model="dataContainer.form.status"
                                :disabled="configData.isShow"
                                active-text="启用"
                                inactive-text="禁用"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :xs="6">
                        <el-form-item label="角色描述" prop="content">
                            <el-input
                                v-model="dataContainer.form.content"
                                :rows="2"
                                type="textarea"
                                :disabled="configData.isShow"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :xs="6">
                        <el-form-item label="菜单权限" prop="menu">
                            <el-tree
                                style="
                                    width: 100%;
                                    border: 1px solid var(--el-border-color);
                                    border-radius: 5px;
                                "
                                :data="dataContainer.treeData"
                                :disabled="configData.isShow"
                                :props="{
                                    children: 'children',
                                    label: 'label',
                                    disabled: 'disabled',
                                }"
                                show-checkbox
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
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
                    提交
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
import { messageError } from '@/action/messagePrompt.js';
//配置信息，初始化时使用
const configMap = {
    open: {
        default: false,
    },
    title: {
        default: '角色数据',
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
    components: {},
    setup() {
        const configData = reactive({});
        const FormElRef = ref(null); //组件实例
        const dataContainer = reactive({
            loading: false,
            closeType: 'close', //关闭时的类型，是由确认取消按钮关闭的还是其他地方关闭的 confirm cancel
            resolve: undefined, //返给外部promise的回调
            reject: undefined,
            form: {},
            rules: {
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
            },
            treeData: [
                {
                    id: 1,
                    label: 'Level one 1',
                    children: [
                        {
                            id: 3,
                            label: 'Level two 2-1',
                            children: [
                                {
                                    id: 4,
                                    label: 'Level three 3-1-1',
                                },
                                {
                                    id: 5,
                                    label: 'Level three 3-1-2',
                                    disabled: true,
                                },
                            ],
                        },
                        {
                            id: 2,
                            label: 'Level two 2-2',
                            disabled: true,
                            children: [
                                {
                                    id: 6,
                                    label: 'Level three 3-2-1',
                                },
                                {
                                    id: 7,
                                    label: 'Level three 3-2-2',
                                    disabled: true,
                                },
                            ],
                        },
                    ],
                },
            ],
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
            dataContainer.form = {};
            otherDataContainer.castParams = {};
            configData.open = show;
            nextTick(() => {
                dataContainer.form = data;
                // getDataInfo();
            });
            return new Promise((r, j) => {
                dataContainer.resolve = r;
                dataContainer.reject = j;
            });
        }
        /** 获取数据详细 */
        function getDataInfo() {
            dataContainer.form = {};
        }
        /** 提交数据 */
        function handleSubmit() {
            /** 使用组件自带方法验证数据 */
            if (!FormElRef.value) return;
            FormElRef.value.validate((valid, e) => {
                if (e) {
                    /** 打印报错信息 */
                    let msg = e[Object.keys(e)[0]][0].message;
                    messageError(msg);
                }
                if (!valid) return;
                setTimeout(() => {
                    otherDataContainer.castParams = {
                        name: '数据保存成功了，向外部通知',
                    };
                    dataContainer.closeType = 'confirm';
                    configData.open = false;
                }, 1000);
            });
        }
        /**
         * 数据验证
         * 外部可调用
         *  */
        function validData(data) {
            const failData = verifiedData(data, {
                name: {
                    msg: '名称 不能为空',
                    validate(value, option) {
                        if (!value && value !== 0) return false;
                        return true;
                    },
                },
            });
            return failData;
        }
        return {
            configData,
            initData,
            dataContainer,
            handleClose,
            getDataInfo,
            handleSubmit,
            FormElRef,
            validData,
        };
    },
});
</script>

<style lang="scss" scoped>
.edit-data-dialog {
    .dialog-container {
        padding: 15px 15px 0 15px;
        box-sizing: border-box;
    }
}
</style>
