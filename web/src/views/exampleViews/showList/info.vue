<template>
    <div class="page-container main-view">
        <el-row
            :gutter="0"
            v-show="dataContainer.showSearch"
            class="page-query-box">
            <el-col :span="24" :xs="24">
                <el-form
                    :model="dataContainer.form"
                    ref="QueryFormRef"
                    :inline="true"
                    label-width="110px">
                    <el-row :gutter="0">
                        <el-col :span="6" :xs="6">
                            <el-form-item label="线索编号" prop="clueCode">
                                <el-input
                                    v-model="dataContainer.form.clueCode"
                                    placeholder="请输入"
                                    clearable
                                    @clear="handleQuery"
                                    @keyup.enter="handleQuery"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :xs="6">
                            <el-form-item label="线索编号" prop="clueCode">
                                <el-input
                                    v-model="dataContainer.form.clueCode"
                                    placeholder="请输入"
                                    clearable
                                    @clear="handleQuery"
                                    @keyup.enter="handleQuery"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :xs="6">
                            <el-form-item label="线索编号" prop="clueCode">
                                <el-input
                                    v-model="dataContainer.form.clueCode"
                                    placeholder="请输入"
                                    clearable
                                    @clear="handleQuery"
                                    @keyup.enter="handleQuery"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :xs="6">
                            <el-form-item label="线索名称" prop="clueName">
                                <el-input
                                    v-model="dataContainer.form.clueName"
                                    placeholder="请输入"
                                    clearable
                                    @clear="handleQuery"
                                    @keyup.enter="handleQuery"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :xs="6">
                            <el-form-item label="线索名称" prop="clueName">
                                <el-input
                                    v-model="dataContainer.form.clueName"
                                    placeholder="请输入"
                                    clearable
                                    @clear="handleQuery"
                                    @keyup.enter="handleQuery"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="8">
                            <el-form-item label=" ">
                                <el-button
                                    type="primary"
                                    @click="handleQuery">
                                    <SvgIcon name="Navbar-full"></SvgIcon>
                                    查询
                                </el-button>
                                <el-button
                                    icon="Refresh"
                                    @click="resetQuery">
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
                    <el-button
                        type="primary"
                        @click="handleAdd">
                        新增
                    </el-button>
                    <el-button
                        plain
                        type="primary" @click="handleExport">
                        导出
                    </el-button>
                    <el-button
                        plain
                        type="danger"
                        v-if="dataContainer.currDataList.length>0"
                        @click="handleDelete(dataContainer.currDataList)">
                        批量删除
                    </el-button>
                </div>
                <div class="right">
                    
                </div>
            </div>
            <div class="table-container">
                <el-table
                    v-loading="dataContainer.loading"
                    :data="dataContainer.list"
                    border
                    @cell-dblclick ="handleCopyVale"
                    @sort-change="handleSortChange"
                    height="100%">
                    <el-table-column type="index" align="center" label="序号" width="60" fixed="left"/>
                    <el-table-column
                        label="线索编号"
                        show-overflow-tooltip
                        align="center"
                        min-width="170"
                        prop="clueCode"
                        sortable="custom"
                        :sort-orders="['descending', 'ascending']"/>
                    <el-table-column
                        label="线索名称"
                        show-overflow-tooltip
                        align="center"
                        prop="clueName"
                        min-width="150"
                        sortable="custom"
                        :sort-orders="['descending', 'ascending']"/>
                    <el-table-column
                        label="客户名称"
                        show-overflow-tooltip
                        align="center"
                        prop="clientName"
                        min-width="150"
                        sortable="custom"
                        :sort-orders="['descending', 'ascending']"/>
                    <el-table-column
                        label="线路主题"
                        show-overflow-tooltip
                        align="center"
                        prop="studyRouteName"
                        min-width="150"
                        sortable="custom"
                        :sort-orders="['descending', 'ascending']"/>
                    <el-table-column
                        label="项目编号"
                        show-overflow-tooltip
                        align="center"
                        prop="projectCode"
                        min-width="150"
                        sortable="custom"
                        :sort-orders="['descending', 'ascending']"/>
                    <el-table-column
                        label="创建时间"
                        show-overflow-tooltip
                        align="center"
                        prop="createTime"
                        min-width="150"
                        sortable="custom"
                        :sort-orders="['descending', 'ascending']"/>
                    <el-table-column
                        label="操作"
                        width="250"
                        fixed="right"
                        class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button
                                :text="true"
                                @click="handleDetails(scope.row,{
                                    isShow:true,
                                    afterTitle:' - 查看',
                                })">
                                查看
                            </el-button>
                            <el-button
                                :text="true"
                                @click="handleEdit(scope.row,{
                                    isShow:true,
                                    afterTitle:' - 编辑',
                                })">
                                编辑
                            </el-button>
                            <el-button
                                :text="true"
                                @click="handleDelete([scope.row])">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div
                class="pagination-container">
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
                        size => {
                            dataContainer.params.pageSize = size;
                            getDataList();
                        }
                    "
                    @current-change="
                        page => {
                            dataContainer.params.pageNum = page;
                            getDataList();
                        }
                    "
                />
            </div>
        </div>
        <EditDataDialog
            ref="EditDataDialogRef"></EditDataDialog>
    </div>
</template>

<script>
/**
 * 页面例子
 */
import {defineComponent,onBeforeUnmount,ref,reactive,getCurrentInstance,onActivated} from 'vue';
import { useRouter } from "vue-router";
import { copyValue } from '@/common/OtherTools';
import DictTags from '@/components/DictTags.vue';
import {debounceFn} from "@/common/DebounceAndThrottle";
import {responseData} from "./common/Data.js";
import {messageSuccess,confirm} from "@/common/MessagePrompt.js";
import EditDataDialog from "./components/EditDataDialog.vue";
import SvgIcon from "@/components/svgIcon/index.vue";

export default defineComponent({
    components: {
        DictTags,
        EditDataDialog,
        SvgIcon,
    },
    setup() {
        const EditDataDialogRef = ref(null);  //组件实例
        const router = useRouter();
        const dataContainer = reactive({
            loading:false,
            showSearch:true,
            form: {},
            params: {
                //基础参数
                pageNum: 1,
                pageSize: 10,
            },
            config: {
                total: 0,
            },
            list: [],
            currDataList:[],
        });
        /** 获取数据列表 */
        const getDataList = debounceFn(function() {
            dataContainer.loading = true;
            Promise.resolve(responseData)
                .then(res => {
                    dataContainer.list = res.rows || [];
                    dataContainer.config.total = res.total;
                    /** 默认不选择 */
                    dataContainer.list.forEach(item=>{
                        item.checked_ = false;
                    });
                    dataContainer.checked_ = false;
                })
                .catch(() => {
                    return;
                })
                .finally(() => {
                    dataContainer.loading = false;
                });
        },300);
        getDataList();
        /** 双击单元格，复制单元格内容 */
        function handleCopyVale(_, __, ___, event){
            copyValue(event.target.innerText);
            messageSuccess("复制成功，内容为："+event.target.innerText);
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
        function handleExport(){
            
        }
        /** 新增按钮操作 */
        function handleAdd() {
            if(!EditDataDialogRef.value) return;
            EditDataDialogRef.value.initData(true,{},{
                afterTitle:' - 添加',
            }).then(()=>{

            }).catch(()=>{

            });
        }
        /** 详情按钮操作 */
        function handleDetails(row,querys) {
            if(!EditDataDialogRef.value) return;
            EditDataDialogRef.value.initData(true,{
                ...row,
            },{
                ...querys,
            }).then(()=>{

            }).catch(()=>{

            });
        }
        /** 编辑按钮操作 */
        function handleEdit(row,querys) {
            if(!EditDataDialogRef.value) return;
            EditDataDialogRef.value.initData(true,{
                ...row,
            },{
                ...querys,
            }).then(()=>{

            }).catch(()=>{

            });
        }
        /** 删除 */
        function handleDelete(rows){
            confirm('确认删除该数据？').then(()=>{
                // dataContainer.loading = true;
                // deleteSalesLeadApi(rows.map(item=>item.id).join(',')).then(() => {
                //     getDataList();
                // }).catch(()=>{
                //     return;
                // }).finally(()=>{
                //     dataContainer.loading = false;
                // });
                messageSuccess("删除成功");
            }).catch(() => {});
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
        };
    },
});
</script>

<style lang="scss" scoped>
    .main-view{
        display: flex;
        flex-direction: column;
        >.page-query-box{
            margin: 0 0 10px 0 !important;
            padding: 10px 10px 0px 10px;
            :deep(.el-form-item){
                margin-bottom: 10px !important;
            }
            :deep(.el-form-item--default){
                width: 100%;
                margin-right: 0;
            }
        }
        >.content-container{
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 10px 10px;
            box-sizing: border-box;
            background: #fff;
            >.top-container{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0px 0 10px 0;
            }
            >.table-container{
                flex: 1 1 auto;
                height: 0;
                overflow: auto;
            }
        }
        .pagination-container{
            display: flex;
            justify-content: flex-end;
            padding: 0;
            margin: 10px 0 0 0;
        }
    }
</style>
