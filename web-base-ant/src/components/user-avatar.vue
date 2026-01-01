<script>
/**
 * 用户头像组件
 */
import { defineComponent, reactive, toRef, watch } from 'vue';

export default defineComponent({
    name: 'UserAvatar',
    components: {},
    props: {
        userInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    setup(props) {
        const dataContainer = reactive({
            userInfo: toRef(props, 'userInfo'),
            error: false,
        });
        watch(
            [toRef(props, 'userInfo')],
            () => {
                dataContainer.error = false;
            },
            {
                immediate: true,
                deep: true,
            },
        );
        function handleError() {
            dataContainer.error = true;
        }
        return {
            dataContainer,
            handleError,
        };
    },
});
</script>

<template>
    <div class="user-avatar">
        <a-image
            v-if="!dataContainer.error"
            :preview="false"
            style="object-fit: cover"
            :src="dataContainer.userInfo.avatar || ''"
            @error="handleError"
        >
        </a-image>
        <div v-else class="name">{{ (dataContainer.userInfo.name || '').slice(0, 1) }}</div>
    </div>
</template>

<style scoped lang="scss">
.user-avatar {
    height: 100%;
    width: 100%;
    background-color: transparent;
    border-radius: 50%;
    overflow: hidden;
    :deep(.ant-image) {
        width: 100%;
        height: 100%;
        .ant-image-img {
            width: 100%;
            height: 100%;
        }
    }
    .name {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #dde1e4;
        font-size: var(--user-name-size, 20px);
        font-weight: bold;
    }
}
</style>
