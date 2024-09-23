<template>
    <el-scrollbar height="100%">
        <div class="page-container main-view">
            <div class="container">
                <h3>数据编辑页面</h3>
                <p>当前加载时间：{{ dataContainer.nowTime }}</p>
                <p>当前加载时间戳：{{ dataContainer.nowTime_1 }}</p>
                <p>数据唯一标识：{{ dataContainer.form.id }}</p>
                <p>
                    <el-button @click="handleClick_2" type="primary">
                        更新标签信息（修改标题，切换缓存状态），不会更改目录配置，就是说重新重目录配置处创建该标签会使用目录的配置
                    </el-button>
                </p>
                <el-form
                    :model="dataContainer.form"
                    ref="FormElRef"
                    :inline="true"
                    :rules="dataContainer.rules"
                    label-width="120px"
                >
                    <el-row :gutter="0">
                        <el-col :span="8" :xs="6">
                            <el-form-item label="修改数据名称" prop="name">
                                <el-input
                                    v-model="dataContainer.form.name"
                                    placeholder="请输入"
                                    clearable
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="6">
                            <el-form-item label="修改数据code" prop="code">
                                <el-input
                                    v-model="dataContainer.form.code"
                                    placeholder="请输入"
                                    clearable
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="6">
                            <el-form-item label="修改数据id" prop="id">
                                <el-input
                                    v-model="dataContainer.form.id"
                                    placeholder="请输入"
                                    clearable
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="6">
                            <el-form-item label="修改数据id" prop="id">
                                <el-input
                                    v-model="dataContainer.form.id"
                                    placeholder="请输入"
                                    clearable
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
            </div>
        </div>
    </el-scrollbar>
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
    onMounted,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';
import { Delete } from '@element-plus/icons-vue';
import { verifiedData } from '@/common/verifiedTools';
import { messageError } from '@/action/messagePrompt.js';
import { findTag, updateTag } from '@/action/tagListTools';

export default defineComponent({
    components: {
        SvgIcon,
        Delete,
    },
    setup() {
        const FormElRef = ref(null); //组件实例
        const router = useRouter();
        const route = useRoute();
        const dataContainer = reactive({
            loading: false,
            form: {},
            nowTime: new Date(),
            nowTime_1: new Date().getTime(),
            rules: {
                name: [{ required: true, message: '请输入数据', trigger: 'blur' }],
            },
        });
        /**
         * 数据初始化
         */
        function initData() {
            let params = route.params;
            if (!params.sign) return;
            dataContainer.form = {
                id: params.sign,
            };
        }
        initData();
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
                /** 像后端提交 */
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
        function handleClick_2() {
            let tag = findTag(route.path) || {};
            if (!tag) return;
            updateTag({
                tag: {
                    ...tag,
                    title: tag.title + '-1',
                    isCache: !tag.isCache,
                },
                layoutName: tag.layoutName,
            });
        }
        return {
            dataContainer,
            initData,
            FormElRef,
            handleSubmit,
            handleClick_2,
        };
    },
});
</script>

<style lang="scss" scoped>
.main-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    .container {
        background-color: white;
        width: 100%;
        // min-height: 800px;
        height: fit-content;
        border-radius: 5px;
        padding: 15px;
        box-sizing: border-box;
        > * {
            margin: 0 0 30px 0;
            &:last-child {
                margin: 0;
            }
        }
    }
}
</style>
