<script>
/**
 * 首页
 */
import { defineComponent, reactive } from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import DefinScrollbar from '@/components/definScrollbar.vue';

export default defineComponent({
    components: {
        SvgIcon,
        DefinScrollbar,
    },
    setup() {
        const dataContainer = reactive({
            name: import.meta.env.VITE_APP_name,
            loading: false,
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <DefinScrollbar height="100%" :showUpBt="true">
        <div class="page-container main-view">
            <div class="container">
                <h1>{{ dataContainer.name }}</h1>
                <p>自定义页面菜单，标签页可自定义是否缓存。</p>
                <p>标签页下面有小横条的表示有缓存。 标签上鼠标右击可以操作。</p>
            </div>
        </div>
    </DefinScrollbar>
</template>

<style lang="scss" scoped>
.main-view {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: rgb(232, 232, 232);
    .container {
        width: 100%;
        min-height: 800px;
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
