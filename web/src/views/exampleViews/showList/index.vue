<template>
    <div class="page-container main-view">
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
                            <el-col class="anchor-point-target" :span="6" :xs="6">
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
                            <el-col :span="6" :xs="6">
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
                            <el-col :span="6" :xs="6">
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
                            <el-col :span="6" :xs="6">
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
                            <el-col :span="6" :xs="6">
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
                            <el-col :span="6" :xs="6">
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
                    <el-button
                        v-if="hasPermi(['yx:apply:apply'])"
                        type="primary"
                        @click="handleAdd"
                    >
                        新增
                    </el-button>
                    <el-button plain type="primary" @click="handleExport"> 导出 </el-button>
                    <el-button
                        plain
                        type="danger"
                        v-if="dataContainer.currentRows.length > 0"
                        @click="handleDelete(dataContainer.currentRows)"
                    >
                        批量删除：{{ dataContainer.currentRows.length }}
                    </el-button>
                    <p style="margin: 0; padding: 0">
                        数据编辑以新开页面的形式，搜索栏部分收缩可保留一行。
                    </p>
                </div>
                <div class="right">
                    <el-button circle @click="resetQuery">
                        <SvgIcon :style="'width:15px;height:15px;'" name="svg:redo.svg"></SvgIcon>
                    </el-button>
                    <el-button circle @click="dataContainer.showSearch = !dataContainer.showSearch">
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
                    height="100%"
                >
                    <el-table-column
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
                        width="200"
                        fixed="right"
                        class-name="small-padding fixed-width"
                    >
                        <template #default="scope">
                            <el-button
                                link
                                type="default"
                                @click="
                                    handleDetails(scope.row, {
                                        isShow: true,
                                        afterTitle: ' - 查看',
                                    })
                                "
                            >
                                查看
                            </el-button>
                            <el-button
                                link
                                type="primary"
                                @click="
                                    handleEdit(scope.row, {
                                        isShow: true,
                                        afterTitle: ' - 编辑',
                                    })
                                "
                            >
                                编辑
                            </el-button>
                            <el-button link type="danger" @click="handleDelete([scope.row])">
                                删除
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
</template>

<script>
/**
 * 页面例子
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
} from 'vue';
import { useRouter } from 'vue-router';
import { copyValue } from '@/common/otherTools';
import DictTags from '@/components/dictTags.vue';
import { debounceFn } from '@/common/debounceAndThrottle';
import { responseData } from './common/data.js';
import { messageSuccess, confirm } from '@/action/messagePrompt.js';
import SvgIcon from '@/components/svgIcon/index.vue';
import { hasPermi } from '@/action/powerTools';
import DifinCollapse from '@/components/difinCollapse.vue';
import { saveAs } from 'file-saver';

export default defineComponent({
    components: {
        DictTags,
        SvgIcon,
        DifinCollapse,
    },
    setup() {
        const router = useRouter();
        const dataContainer = reactive({
            loading: false,
            showSearch: true,
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
            optionList: [
                { value: true, label: '不可选择', elTagType: 'danger' },
                { value: false, label: '可选择', elTagType: 'primary' },
            ],
        });
        /** 获取数据列表 */
        const getDataList = debounceFn(function () {
            if (dataContainer.loading) return;
            dataContainer.loading = true;
            setTimeout(() => {
                Promise.resolve(responseData)
                    .then((res) => {
                        dataContainer.list = res.rows || [];
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
        /** 导出数据 */
        function handleExport() {
            let str = '保存字符串的例子！！';
            let strData = new Blob([str], { type: 'text/plain;charset=utf-8' });
            saveAs(strData, '测试文件下载.txt');
            messageSuccess('导出成功！');
        }
        /** 新增按钮操作 */
        function handleAdd() {
            router.push({
                name: 'show-list-add',
            });
        }
        /** 详情按钮操作 */
        function handleDetails(row, querys) {
            router.push({
                name: 'show-list-info',
                params: {
                    sign: row.id || new Date().getTime(),
                },
                querys,
            });
        }
        /** 编辑按钮操作 */
        function handleEdit(row, querys) {
            router.push({
                name: 'show-list-update',
                params: {
                    sign: row.id || new Date().getTime(),
                },
                querys,
            });
        }
        /** 删除 */
        function handleDelete(rows) {
            confirm('确认删除所选数据？', '提示！')
                .then(() => {
                    // dataContainer.loading = true;
                    // deleteSalesLeadApi(rows.map(item=>item.id).join(',')).then(() => {
                    //     getDataList();
                    // }).catch(()=>{
                    //     return;
                    // }).finally(()=>{
                    //     dataContainer.loading = false;
                    // });
                    messageSuccess('删除成功');
                })
                .catch(() => {});
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
        return {
            dataContainer,
            getDataList,
            handleCopyVale,
            handleSortChange,
            handleQuery,
            resetQuery,
            handleExport,
            handleAdd,
            handleDetails,
            handleEdit,
            handleDelete,
            hasPermi,
            changeAllCheck,
            isDisabled,
            handleSelectionChange,
        };
    },
});
</script>

<style lang="scss" scoped>
.main-view {
    display: flex;
    flex-direction: column;
    /** 页面间隔css变量，可自行调节 */
    --view-gap: 10px;
    > .page-query-box {
        margin: 0 0 var(--view-gap) 0 !important;
        padding: var(--view-gap) var(--view-gap) 0px var(--view-gap);
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
        padding: var(--view-gap) var(--view-gap);
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
