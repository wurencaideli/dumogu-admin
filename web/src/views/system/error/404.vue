<script>
/*
 * 404
 */
import {
    defineComponent,
    ref,
    getCurrentInstance,
    reactive,
    toRef,
    computed,
    onMounted,
    watch,
} from 'vue';
import svg404 from '@/assets/img-list/404.svg';

export default defineComponent({
    setup() {
        const dataContainer = reactive({
            svg404: svg404,
        });
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="main-404-view">
        <div class="container">
            <img :src="dataContainer.svg404" />
            <div class="right">
                <div class="title">404错误!没找到该页面</div>
                <div class="content">
                    对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
                </div>
                <router-link class="bt" to="/main/index"> 返回首页 </router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-404-view {
    height: 100%;
    width: 100%;
    font-weight: bold;
    line-height: 1.5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    > .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        max-width: 1000px;
        > img {
            flex: 1 1 0;
            width: 0;
            height: 262px;
            border: 1px solid #e1e1e1;
            border-radius: 12px;
            box-sizing: border-box;
        }
        > .right {
            margin-left: 30px;
            flex: 1 1 0;
            width: 0;
            > .title {
                font-size: 32px;
                font-weight: bold;
                line-height: 40px;
                color: #1482f0;
                margin-bottom: 40px;
            }
            > .content {
                font-size: 13px;
                line-height: 21px;
                color: grey;
                margin-bottom: 40px;
            }
            > .bt {
                width: 130px;
                height: 46px;
                background: #1482f0;
                border-radius: 100px;
                text-align: center;
                color: #ffffff;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 16px;
            }
        }
    }
}
</style>
