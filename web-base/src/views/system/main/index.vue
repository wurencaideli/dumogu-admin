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
                <p>
                    1. 基于此模板开发的有着丰富组件的例子，点击查看
                    <a
                        href="https://admin.dumogu.top/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="color: #a8a0f1; font-weight: bold"
                    >
                        DEMO（elment-plus + vue3）
                    </a>
                </p>
                <p>
                    2. 和此模板一样的基础例子，点击查看
                    <a
                        href="https://admin.dumogu.top/base-naive-ui/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="color: #a8a0f1; font-weight: bold"
                    >
                        DEMO（naive-ui + vue3）
                    </a>
                </p>
                <p>
                    3. 此项目使用
                    <a
                        href="https://codess.dumogu.top/manage-packets/w-project/1.0.0/js"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="color: #a8a0f1; font-weight: bold"
                    >
                        CODESS
                    </a>
                    来自定义部分代码提示。
                </p>
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
