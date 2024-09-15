<template>
    <div class="page-container main-view">
        <el-row :gutter="0" v-show="dataContainer.showSearch" class="page-query-box">
            <el-col :span="24" :xs="24">
                <el-form
                    :model="dataContainer.form"
                    ref="QueryFormRef"
                    :inline="true"
                    label-width="110px"
                >
                    <el-row :gutter="0">
                        <el-col :span="8" :xs="8">
                            <el-form-item label="名称" prop="name">
                                <el-input
                                    v-model="dataContainer.form.name"
                                    placeholder="请输入"
                                    clearable
                                    @clear="handleQuery"
                                    @keyup.enter="handleQuery"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="8">
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
        </el-row>
        <div class="table-box content-container page-content-box">
            <div class="top-container">
                <div class="left">
                    <el-button type="primary" @click="handleAdd"> 新增 </el-button>
                    <el-button plain type="primary" @click="handleExport"> 导出 </el-button>
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
                    ref="ElTableRef"
                    v-loading="dataContainer.loading"
                    :data="dataContainer.list"
                    @cell-dblclick="handleCopyVale"
                    border
                    row-key="id"
                    :tree-props="{
                        children: 'childs',
                    }"
                    height="100%"
                >
                    <el-table-column
                        type="index"
                        align="left"
                        label="序号"
                        width="60"
                        fixed="left"
                    />
                    <el-table-column
                        label="权限按钮名称"
                        show-overflow-tooltip
                        align="left"
                        min-width="170"
                        prop="name"
                    />
                    <el-table-column
                        label="权限字符"
                        show-overflow-tooltip
                        align="left"
                        min-width="170"
                        prop="content"
                    />
                    <el-table-column
                        label="排序"
                        show-overflow-tooltip
                        align="left"
                        prop="sort"
                        min-width="150"
                    />
                    <el-table-column
                        label="操作"
                        width="200"
                        fixed="right"
                        class-name="small-padding fixed-width"
                    >
                        <template #default="scope">
                            <el-button
                                :text="true"
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
                                :text="true"
                                @click="
                                    handleEdit(scope.row, {
                                        isShow: false,
                                        afterTitle: ' - 编辑',
                                    })
                                "
                            >
                                编辑
                            </el-button>
                            <el-button :text="true" type="danger" @click="handleDelete(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <EditDataDialog ref="EditDataDialogRef"></EditDataDialog>
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
import { copyValue, deepCopyObj } from '@/common/otherTools';
import DictTags from '@/components/dictTags.vue';
import { debounceFn } from '@/common/debounceAndThrottle';
import { responseData } from './common/data.js';
import { messageSuccess, confirm } from '@/action/messagePrompt.js';
import EditDataDialog from './components/editDataDialog.vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { hasPermi } from '@/action/powerTools';

export default defineComponent({
    components: {
        DictTags,
        EditDataDialog,
        SvgIcon,
    },
    setup() {
        const EditDataDialogRef = ref(null); //组件实例
        const router = useRouter();
        const dataContainer = reactive({
            loading: false,
            showSearch: true,
            form: {},
            params: {
                //基础参数
            },
            list: [],
        });
        /** 获取数据列表 */
        const getDataList = debounceFn(function () {
            dataContainer.loading = true;
            Promise.resolve(responseData)
                .then((res) => {
                    let list = deepCopyObj(res.rows || []);
                    dataContainer.list = list;
                })
                .catch(() => {
                    return;
                })
                .finally(() => {
                    dataContainer.loading = false;
                });
        }, 300);
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
        function handleExport() {}
        /** 新增按钮操作 */
        function handleAdd(params) {
            if (!EditDataDialogRef.value) return;
            EditDataDialogRef.value
                .initData(
                    true,
                    {
                        ...params,
                    },
                    {
                        afterTitle: ' - 添加',
                    },
                )
                .then((data) => {})
                .catch(() => {});
        }
        /** 详情按钮操作 */
        function handleDetails(row, querys) {
            if (!EditDataDialogRef.value) return;
            EditDataDialogRef.value
                .initData(
                    true,
                    {
                        ...row,
                    },
                    {
                        ...querys,
                    },
                )
                .then(() => {})
                .catch(() => {});
        }
        /** 编辑按钮操作 */
        function handleEdit(row, querys) {
            if (!EditDataDialogRef.value) return;
            EditDataDialogRef.value
                .initData(
                    true,
                    {
                        ...row,
                    },
                    {
                        ...querys,
                    },
                )
                .then((data) => {})
                .catch(() => {});
        }
        /** 删除 */
        function handleDelete(data) {
            confirm('确认删除该数据？', '提示')
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
            EditDataDialogRef,
            hasPermi,
        };
    },
});
</script>

<style lang="scss" scoped>
.main-view {
    display: flex;
    flex-direction: column;
    > .page-query-box {
        margin: 0 0 10px 0 !important;
        padding: 10px 10px 0px 10px;
        :deep(.el-form-item) {
            margin-bottom: 10px !important;
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
        padding: 10px 10px;
        box-sizing: border-box;
        background: #fff;
        > .top-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0px 0 10px 0;
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
        margin: 10px 0 0 0;
    }
}
</style>
