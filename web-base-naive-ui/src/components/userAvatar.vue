<script>
/**
 * 用户头像组件
 */
import { defineComponent, reactive, toRef } from 'vue';

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
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="user-avatar">
        <n-image preview-disabled :src="dataContainer.userInfo.avatar || ''" object-fit="cover">
            <template #placeholder>
                <div class="name">
                    {{ (dataContainer.userInfo.name || '').slice(0, 1) }}
                </div>
            </template>
        </n-image>
    </div>
</template>

<style scoped lang="scss">
.user-avatar {
    height: 100%;
    width: 100%;
    :deep(.n-image) {
        height: 100%;
        width: 100%;
        background-color: transparent;
        border-radius: 50%;
        overflow: hidden;
        img {
            height: 100%;
            width: 100%;
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
}
</style>
