<template>
    <div class="page-container main-view">
        123
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
