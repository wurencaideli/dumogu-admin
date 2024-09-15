<template>
    <div class="dict-tags">
        <div
            v-for="(item, index) in values"
            :key="index"
            :style="{
                marginRight: values.length > 0 ? '5px' : '',
            }"
            class="item"
        >
            <span v-if="item.elTagType == 'default' || !item.elTagType" :class="item.elTagType">
                {{ item[dataContainer.labelKey] }}
            </span>
            <el-tag
                v-else
                :disable-transitions="true"
                :type="item.elTagType === 'primary' ? '' : item.elTagType"
                :class="item.elTagType"
            >
                {{ item[dataContainer.labelKey] }}
            </el-tag>
        </div>
    </div>
</template>

<script>
/** 根据options 展示value为tag形式 */
import { defineComponent, ref, reactive, toRef, computed } from 'vue';

export default defineComponent({
    name: 'DictTags',
    props: {
        options: {
            // 列表数据
            type: Array,
            default: [],
        },
        value: {
            // 当前的值
            type: [Number, String, Array, Boolean],
            default: '',
        },
        valueKey: {
            type: String,
            default: 'value',
        },
        labelKey: {
            type: String,
            default: 'label',
        },
    },
    setup(props) {
        const dataContainer = reactive({
            options: toRef(props, 'options'),
            value: toRef(props, 'value'),
            valueKey: toRef(props, 'valueKey'),
            labelKey: toRef(props, 'labelKey'),
        });
        const values = computed(() => {
            if (Array.isArray(dataContainer.value)) {
                return dataContainer.options.filter((item) => {
                    return dataContainer.value.includes(item[dataContainer.valueKey]);
                });
            } else {
                const data = dataContainer.options.find(
                    (item) => item[dataContainer.valueKey] == dataContainer.value,
                );
                return data
                    ? [data]
                    : [
                          {
                              [dataContainer.labelKey]: dataContainer.value,
                              elTagType: '',
                          },
                      ];
            }
        });
        return {
            dataContainer,
            values,
        };
    },
});
</script>

<style lang="scss" scoped>
.dict-tags {
    > .item {
        display: inline;
        :deep(.el-tag) {
            margin-right: 5px;
        }
    }
}
</style>
