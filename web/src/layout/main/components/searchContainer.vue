<script>
/*
 * 头部组件
 * 提供类名供外部调整
 */
import { defineComponent, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/svgIcon/index.vue';

export default defineComponent({
    name: 'SearchContainer',
    components: {
        SvgIcon,
    },
    setup() {
        const router = useRouter();
        /** 跳转去相应页面 */
        function toPath(params) {
            router.push(params);
        }
        /** 添加打开新标签页的操作 */
        function addNewPage() {
            toPath('/main/new-tag-page/search-new-page');
        }
        /** 添加键盘按下事件监听器 */
        function callBack_1(event) {
            // 检查是否按下了"Alt + S"组合键
            if (event.altKey && event.key && event.key.toLowerCase() === 's') {
                addNewPage();
            }
        }
        document.addEventListener('keydown', callBack_1);
        onUnmounted(() => {
            document.removeEventListener('keydown', callBack_1);
        });
        return {
            addNewPage,
        };
    },
});
</script>

<template>
    <div @click="addNewPage" class="search-container-cp">
        <div class="left">
            <SvgIcon
                :style="'width:17px;height:17px;margin-right:10px;'"
                name="svg:search-bt.svg"
            ></SvgIcon>
            搜索目录
        </div>
        <div class="right">Alt S</div>
    </div>
</template>

<style scoped lang="scss">
.search-container-cp {
    width: 100%;
    height: 40px;
    background-color: #e3e5e8;
    transition: all 0.2s;
    pointer-events: initial;
    border-radius: 8px;
    padding: 0 10px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #4e5058;
    > .left {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 15px;
    }
    > .right {
        border: 1px solid #777777;
        padding: 3px 5px;
        font-size: 12px;
        border-radius: 5px;
        font-weight: bold;
    }
}
</style>
