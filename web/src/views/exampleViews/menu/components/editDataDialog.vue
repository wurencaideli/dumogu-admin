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
                label-width="150px"
            >
                <el-row :gutter="0">
                    <el-col :span="24">
                        <el-form-item label="提示">
                            <p style="opacity: 0.8">
                                上级菜单不允许选比自己层级小的层级，其中路由名称表示页面的名称（只能选系统有的），路由地址表示跳转地址，没有的话会根据路由名称自动匹配，可以定义外部链接
                            </p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="上级菜单" prop="parentId">
                            <el-tree-select
                                style="width: 100%"
                                v-model="dataContainer.form.parentId"
                                placeholder="请选择"
                                :disabled="configData.isShow"
                                clearable
                                :data="dataContainer.menuList"
                                check-strictly
                                :render-after-expand="false"
                                show-checkbox
                                :check-on-click-node="true"
                                value-key="id"
                                :props="{
                                    children: 'childs',
                                    label: 'title',
                                    value: 'id',
                                    disabled(data) {
                                        return data.treeLevels >= dataContainer.form.treeLevels;
                                    },
                                }"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="菜单名称" prop="title">
                            <el-input
                                v-model="dataContainer.form.title"
                                placeholder="请输入"
                                :disabled="configData.isShow"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="菜单简介" prop="content">
                            <el-input
                                v-model="dataContainer.form.content"
                                placeholder="请输入"
                                :disabled="configData.isShow"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="路由名称(跳转页面)" prop="name">
                            <el-select
                                placeholder="请选择"
                                style="width: 100%"
                                :disabled="configData.isShow"
                                v-model="dataContainer.form.name"
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in dataContainer.sysMeluConfigList.filter(
                                        (item) => {
                                            return item.title || item.name;
                                        },
                                    )"
                                    :key="index"
                                    :label="item.title || item.name"
                                    :value="item.name"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="路由地址/链接" prop="path">
                            <el-input
                                v-model="dataContainer.form.path"
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
                        <el-form-item label="图标" prop="iconName">
                            <IconSlect
                                :name="dataContainer.form.iconName"
                                :isShow="configData.isShow"
                                @change="
                                    (e) => {
                                        dataContainer.form.iconName = e;
                                    }
                                "
                            >
                            </IconSlect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="是否缓存" prop="isCache">
                            <el-switch
                                v-model="dataContainer.form.isCache"
                                :disabled="configData.isShow"
                                active-text="是"
                                inactive-text="否"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="是否隐藏" prop="hidden">
                            <el-switch
                                v-model="dataContainer.form.hidden"
                                :disabled="configData.isShow"
                                active-text="是"
                                inactive-text="否"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="是否外部链接" prop="isLink">
                            <el-switch
                                v-model="dataContainer.form.isLink"
                                :disabled="configData.isShow"
                                active-text="是"
                                inactive-text="否"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :xs="6">
                        <el-form-item label="是否标签页固定" prop="fixed">
                            <el-switch
                                v-model="dataContainer.form.fixed"
                                :disabled="configData.isShow"
                                active-text="是"
                                inactive-text="否"
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
                <el-button
                    v-if="!configData.isShow"
                    type="primary"
                    :loading="dataContainer.loading"
                    @click="handleSubmit"
                >
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
import SvgIcon from '@/components/svgIcon/index.vue';
import IconSlect from '@/components/iconSlect.vue';
import { sysMeluConfigList } from '@/router/common';
//配置信息，初始化时使用
const configMap = {
    open: {
        default: false,
    },
    title: {
        default: '菜单数据',
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
        SvgIcon,
        IconSlect,
    },
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
                title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
            },
            menuList: [],
            sysMeluConfigList: sysMeluConfigList,
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
                dataContainer.menuList = option.menuList || [];
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
                dataContainer.loading = true;
                setTimeout(() => {
                    /** 没有后台，所以直接将数据向外部抛出 */
                    otherDataContainer.castParams = dataContainer.form;
                    dataContainer.closeType = 'confirm';
                    configData.open = false;
                    dataContainer.loading = false;
                }, 100);
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
