<template>
    <el-autocomplete
        v-model="iconName"
        :fetch-suggestions="getIconDataList"
        style="width: 100%"
        :disabled="dataContainer.isShow"
        :hide-loading="true"
        popper-class="icon-select-cp-item"
        placeholder=""
    >
        <!-- autocomplete suggestions -->
        <template #suffix>
            <SvgIcon :style="'width:20px;height:20px;'" :name="iconName"></SvgIcon>
        </template>
        <template #default="defaultData">
            <div class="item">
                <SvgIcon
                    :style="'width:15px;height:15px;margin-right:10px;'"
                    :name="defaultData.item.value"
                ></SvgIcon>
                {{ defaultData.item.value }}
            </div>
        </template>
    </el-autocomplete>
</template>

<script>
/**
 * icon选择组件
 */
import { defineComponent, ref, getCurrentInstance, reactive, nextTick, computed, toRef } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { iconList } from '@/components/svgIcon/common.js';

export default defineComponent({
    name: 'IconSelect',
    components: {
        SvgIcon,
    },
    props: {
        name: {
            type: String,
            default: '',
        },
        isShow: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['change'],
    setup(props, { emit }) {
        const dataContainer = reactive({
            isShow: toRef(props, 'isShow'),
            name: toRef(props, 'name'),
        });
        const iconName = computed({
            get() {
                return dataContainer.name;
            },
            set(value) {
                emit('change', value);
            },
        });
        /** 获取icon */
        function getIconDataList(value, callback) {
            callback(
                iconList.map((item) => {
                    return {
                        value: item.name,
                    };
                }),
            );
        }
        return {
            dataContainer,
            iconName,
            getIconDataList,
        };
    },
});
</script>

<style lang="scss" scoped>
.icon-select-cp-item {
    .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
}
</style>
