<script>
/*
 * 401
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
import svg401 from '@/assets/img-list/401.svg';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const route = useRoute();
        const dataContainer = reactive({
            svg401: svg401,
            path: '',
        });
        /** 初始化 */
        function initData() {
            let params = route.query || {};
            dataContainer.path = params.fullPath || params.path || '';
        }
        initData();
        return {
            dataContainer,
        };
    },
});
</script>

<template>
    <div class="main-401-view">
        <div class="container">
            <img :src="dataContainer.svg401" />
            <div class="right">
                <div class="title">401错误!无访问权限</div>
                <div class="content">所访问地址：{{ dataContainer.path }}</div>
                <div class="content">
                    对不起，您正在寻找的页面没有访问权限。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。或者向管理员申请访问权限。
                </div>
                <router-link class="bt" to="/main/index"> 返回首页 </router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-401-view {
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
            height: 500px;
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
