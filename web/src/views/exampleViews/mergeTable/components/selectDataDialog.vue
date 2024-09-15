<template>
    <el-dialog
        :title="configData.title + configData.afterTitle"
        v-model="configData.open"
        width="800px"
        :close-on-click-modal="false"
        append-to-body
        destroy-on-close
        :align-center="true"
        @close="handleClose"
        class="edit-data-dialog"
    >
        <div class="dialog-container page-container">
            <el-row :gutter="0" class="page-query-box">
                <DifinCollapse
                    :show="dataContainer.showSearch"
                    :showBt="true"
                    @onClick="dataContainer.showSearch = !dataContainer.showSearch"
                >
                    <el-col :span="24" :xs="24">
                        <el-form
                            :model="dataContainer.form"
                            ref="QueryFormRef"
                            :inline="true"
                            label-width="110px"
                        >
                            <el-row :gutter="0">
                                <el-col class="anchor-point-target" :span="8" :xs="8">
                                    <el-form-item label="用户名称" prop="userName">
                                        <el-input
                                            v-model="dataContainer.form.userName"
                                            placeholder="请输入"
                                            clearable
                                            @clear="handleQuery"
                                            @keyup.enter="handleQuery"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" :xs="8">
                                    <el-form-item label="昵称" prop="nickName">
                                        <el-input
                                            v-model="dataContainer.form.nickName"
                                            placeholder="请输入"
                                            clearable
                                            @clear="handleQuery"
                                            @keyup.enter="handleQuery"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" :xs="8">
                                    <el-form-item label="数据编号" prop="id">
                                        <el-input
                                            v-model="dataContainer.form.id"
                                            placeholder="请输入"
                                            clearable
                                            @clear="handleQuery"
                                            @keyup.enter="handleQuery"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" :xs="8">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input
                                            v-model="dataContainer.form.phone"
                                            placeholder="请输入"
                                            clearable
                                            @clear="handleQuery"
                                            @keyup.enter="handleQuery"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" :xs="8">
                                    <el-form-item label="可选择" prop="disabled">
                                        <el-select
                                            style="width: 100%"
                                            v-model="dataContainer.form.disabled"
                                            placeholder="请选择"
                                            clearable
                                            @clear="handleQuery"
                                            @change="handleQuery"
                                        >
                                            <el-option
                                                v-for="item in dataContainer.optionList"
                                                :key="item.id"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8" :xs="8">
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input
                                            v-model="dataContainer.form.email"
                                            placeholder="请输入"
                                            clearable
                                            @clear="handleQuery"
                                            @keyup.enter="handleQuery"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" :xs="12">
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="handleQuery">
                                            <SvgIcon
                                                :style="'width:15px;height:15px;margin-right:5px;'"
                                                name="svg:search-bt.svg"
                                            ></SvgIcon>
                                            查询
                                        </el-button>
                                        <el-button @click="resetQuery">
                                            <SvgIcon
                                                :style="'width:15px;height:15px;margin-right:5px;'"
                                                name="svg:redo.svg"
                                            ></SvgIcon>
                                            重置
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
                </DifinCollapse>
            </el-row>
            <div class="table-box content-container page-content-box">
                <div class="top-container">
                    <div class="left">
                        <p style="margin: 0; padding: 0">可单选，可多选，可由外部定义搜索条件</p>
                    </div>
                    <div class="right">
                        <el-button circle @click="resetQuery">
                            <SvgIcon
                                :style="'width:15px;height:15px;'"
                                name="svg:redo.svg"
                            ></SvgIcon>
                        </el-button>
                        <el-button
                            circle
                            @click="dataContainer.showSearch = !dataContainer.showSearch"
                        >
                            <SvgIcon
                                :style="'width:15px;height:15px;'"
                                name="svg:search-bt.svg"
                            ></SvgIcon>
                        </el-button>
                    </div>
                </div>
                <div class="table-container">
                    <el-table
                        v-loading="dataContainer.loading"
                        :data="dataContainer.list"
                        border
                        @cell-dblclick="handleCopyVale"
                        @sort-change="handleSortChange"
                        @row-click="
                            (row) => {
                                if (!configData.useRowClick) return;
                                selectItem(row);
                            }
                        "
                        :row-class-name="tableRowClassName"
                        height="100%"
                    >
                        <el-table-column
                            v-if="configData.isMultiple"
                            label="多选组件"
                            align="center"
                            width="40"
                            fixed="left"
                            class-name="small-padding fixed-width"
                        >
                            <template #header>
                                <el-checkbox
                                    style="height: fit-content"
                                    v-model="dataContainer.checked__"
                                    @change="
                                        (e) => {
                                            changeAllCheck(e);
                                            handleSelectionChange(
                                                dataContainer.list.filter((e) => e.checked__),
                                            );
                                        }
                                    "
                                    label=""
                                    size="large"
                                />
                            </template>
                            <template #default="scope">
                                <el-checkbox
                                    v-model="scope.row.checked__"
                                    :disabled="isDisabled(scope.row)"
                                    @change="
                                        () => {
                                            handleSelectionChange(
                                                dataContainer.list.filter((e) => e.checked__),
                                            );
                                        }
                                    "
                                    label=""
                                    size="large"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column
                            type="index"
                            align="center"
                            label="序号"
                            width="60"
                            fixed="left"
                        />
                        <el-table-column
                            label="用户名称"
                            show-overflow-tooltip
                            align="center"
                            min-width="170"
                            prop="userName"
                            sortable="custom"
                            :sort-orders="['descending', 'ascending']"
                        />
                        <el-table-column
                            label="昵称"
                            show-overflow-tooltip
                            align="center"
                            prop="nickName"
                            min-width="150"
                            sortable="custom"
                            :sort-orders="['descending', 'ascending']"
                        />
                        <el-table-column
                            label="数据编号"
                            show-overflow-tooltip
                            align="center"
                            prop="id"
                            min-width="150"
                            sortable="custom"
                            :sort-orders="['descending', 'ascending']"
                        />
                        <el-table-column
                            label="手机号码"
                            show-overflow-tooltip
                            align="center"
                            prop="phone"
                            min-width="150"
                            sortable="custom"
                            :sort-orders="['descending', 'ascending']"
                        />
                        <el-table-column
                            label="可选择"
                            show-overflow-tooltip
                            align="center"
                            prop="disabled"
                            min-width="150"
                            sortable="custom"
                            :sort-orders="['descending', 'ascending']"
                        >
                            <template #default="scope">
                                <DictTags
                                    :options="dataContainer.optionList"
                                    :value="scope.row.disabled"
                                    valueKey="value"
                                    labelKey="label"
                                ></DictTags>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="邮箱"
                            show-overflow-tooltip
                            align="center"
                            prop="email"
                            min-width="150"
                            sortable="custom"
                            :sort-orders="['descending', 'ascending']"
                        />
                        <el-table-column
                            label="操作"
                            width="120"
                            fixed="right"
                            class-name="small-padding fixed-width"
                        >
                            <template #default="scope">
                                <el-button link type="primary" @click.stop="selectItem(scope.row)">
                                    选中
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-container">
                    <el-pagination
                        v-show="true"
                        :total="dataContainer.config.total"
                        :background="true"
                        :current-page="dataContainer.params.pageNum"
                        :page-size="dataContainer.params.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-sizes="[10, 20, 30, 50]"
                        :pager-count="7"
                        @size-change="
                            (size) => {
                                dataContainer.params.pageSize = size;
                                getDataList();
                            }
                        "
                        @current-change="
                            (page) => {
                                dataContainer.params.pageNum = page;
                                getDataList();
                            }
                        "
                    />
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
                <el-button
                    type="primary"
                    v-if="configData.isMultiple && dataContainer.currentRows.length > 0"
                    @click="onChange"
                >
                    确定选择
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
/**
 * 选择数据对话框
 * 例子，可单选可多选，可外部指定搜索条件
 * 数据都由外部指定，内除不做太多操作
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
    nextTick,
} from 'vue';
import { useRouter } from 'vue-router';
import { copyValue } from '@/common/otherTools';
import { deepCopyObj } from '@/common/otherTools';
import DictTags from '@/components/dictTags.vue';
import { debounceFn } from '@/common/debounceAndThrottle';
import { responseData } from '../common/data.js';
import { messageSuccess, confirm } from '@/action/messagePrompt.js';
import SvgIcon from '@/components/svgIcon/index.vue';
import { hasPermi } from '@/action/powerTools';
import DifinCollapse from '@/components/difinCollapse.vue';
import { saveAs } from 'file-saver';
import { mergeObjProperty } from '@/common/otherTools';
import { getDictItem, initDataByConfig } from '@/common/otherTools';
//配置信息，初始化时使用
const configMap = {
    open: {
        default: false,
    },
    title: {
        default: '数据选择',
    },
    afterTitle: {
        default: '',
    },
    isShow: {
        //是否只是展示
        default: false,
    },
    isMultiple: {
        //是否多选
        default: false,
    },
    activedRowKey: {
        default: 'id',
    },
    activedRows: {
        //当前标记的行
        default: () => {
            return [];
        },
    },
    setActivedRow: {
        //当前标记的行,回调
        default: undefined,
    },
    useRowClick: {
        //是否使用行点击选择
        default: false,
    },
    showOtherQuery: {
        //显示其他查询器
        default: true,
    },
};

export default defineComponent({
    name: 'SelectDataDialog',
    components: {
        DictTags,
        SvgIcon,
        DifinCollapse,
    },
    setup(_, { emit }) {
        const configData = reactive({});
        const dataContainer = reactive({
            loading: false,
            showSearch: false,
            checked__: false, //是否全选
            form: {},
            params: {
                //基础参数
                pageNum: 1,
                pageSize: 10,
            },
            config: {
                total: 0,
            },
            list: [], //当前展示的数据列表
            currentRows: [], //当前多选的数据列表
            currentRow: {}, //当前单选的数据
            optionList: [
                { value: true, label: '不可选择', elTagType: 'danger' },
                { value: false, label: '可选择', elTagType: 'primary' },
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
        /** 初始化数据（外部调用） */
        function initData(show = true, data = {}, option = {}) {
            initDataByConfig(configData, option, configMap);
            dataContainer.closeType = 'close';
            dataContainer.loading = false;
            dataContainer.form = {};
            otherDataContainer.castParams = {};
            dataContainer.currentRow = {};
            dataContainer.currentRows = [];
            dataContainer.list = [];
            configData.open = show;
            nextTick(() => {
                dataContainer.form = data || {};
                getDataList();
            });
            return new Promise((r, j) => {
                dataContainer.resolve = r;
                dataContainer.reject = j;
            });
        }
        /** 获取数据列表 */
        const getDataList = debounceFn(function () {
            if (dataContainer.loading) return;
            dataContainer.loading = true;
            setTimeout(() => {
                Promise.resolve(responseData)
                    .then((res) => {
                        dataContainer.list = deepCopyObj(res.rows) || [];
                        dataContainer.config.total = res.total;
                        /** 默认不选择 */
                        dataContainer.list.forEach((item) => {
                            item.checked__ = false;
                        });
                        dataContainer.checked__ = false;
                        /** 清空当前多选的数据 */
                        handleSelectionChange([]);
                    })
                    .catch(() => {
                        return;
                    })
                    .finally(() => {
                        dataContainer.loading = false;
                    });
            }, 800);
        }, 70);
        getDataList();
        /** 双击单元格，复制单元格内容 */
        function handleCopyVale(_, __, ___, event) {
            copyValue(event.target.innerText);
            messageSuccess('复制成功，内容为：' + event.target.innerText);
        }
        /** 排序触发事件 */
        function handleSortChange(column, prop, order) {
            dataContainer.form.orderByColumn = column.prop;
            dataContainer.form.isAsc = column.order;
            getDataList();
        }
        /** 搜索按钮操作 */
        function handleQuery() {
            dataContainer.params.pageNum = 1;
            getDataList();
        }
        /** 重置按钮操作 */
        function resetQuery() {
            dataContainer.form = {};
            handleQuery();
        }
        /** 批次确认多选操作 */
        function changeAllCheck(value) {
            if (!value) {
                dataContainer.list.forEach((item) => {
                    item.checked__ = false;
                });
            } else {
                dataContainer.list.forEach((item) => {
                    if (isDisabled(item)) {
                        item.checked__ = false;
                        return;
                    }
                    item.checked__ = true;
                });
            }
        }
        /** 计算批量操作按钮的显示隐藏 */
        function isDisabled(row) {
            /** 如果该条数据是不可选择的话可以设置 */
            return row.disabled;
        }
        // 多选框选中数据
        function handleSelectionChange(selection) {
            dataContainer.currentRows = selection || [];
        }
        /** 确定选择 */
        function onChange() {
            dataContainer.closeType = 'confirm';
            if (configData.isMultiple) {
                /** 表示是多选 */
                otherDataContainer.castParams = dataContainer.currentRows;
            } else {
                otherDataContainer.castParams = dataContainer.currentRow;
            }
            configData.open = false;
        }
        /** 选择哪一行操作 */
        function selectItem(row) {
            dataContainer.currentRow = row;
            dataContainer.currentRows = [row];
            onChange();
        }
        /** 设置行的颜色 */
        function tableRowClassName(value) {
            let row = value.row;
            let state = false;
            if (configData.setActivedRow) {
                //优先使用回调
                state = configData.setActivedRow(row);
            } else {
                state = configData.activedRows.some((item) => {
                    return row[configData.activedRowKey] == item;
                });
            }
            return state ? 'is-current-row' : '';
        }
        return {
            handleClose,
            configData,
            initData,
            getDataList,
            onChange,
            dataContainer,
            selectItem,
            handleQuery,
            tableRowClassName,
            handleSelectionChange,
            getDataList,
            handleCopyVale,
            handleSortChange,
            resetQuery,
            hasPermi,
            changeAllCheck,
            isDisabled,
        };
    },
});
</script>

<style lang="scss" scoped>
.dialog-container {
    height: 60vh;
    display: flex;
    flex-direction: column;
    /** 页面间隔css变量，可自行调节 */
    --view-gap: 10px;
    :deep(.table-row-warning) {
        background-color: #ffa7a7 !important;
    }
    > .page-query-box {
        margin: 0 0 var(--view-gap) 0 !important;
        padding: 0;
        :deep(.el-form-item) {
            margin-bottom: var(--view-gap) !important;
        }
        :deep(.el-form-item--default) {
            width: 100%;
            margin-right: 0;
        }
    }
    > .content-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
        box-sizing: border-box;
        background: #fff;
        > .top-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0px 0 var(--view-gap) 0;
            > .left {
                display: flex;
                flex-direction: row;
                align-items: center;
                > * {
                    margin: 0 var(--view-gap) 0 0 !important;
                }
            }
            > .right {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                > * {
                    margin: 0 0px 0 var(--view-gap) !important;
                }
            }
        }
        > .table-container {
            flex: 1 1 auto;
            height: 0;
            overflow: auto;
        }
    }
    .pagination-container {
        display: flex;
        justify-content: flex-end;
        padding: 0;
        margin: var(--view-gap) 0 0 0;
    }
}
</style>
