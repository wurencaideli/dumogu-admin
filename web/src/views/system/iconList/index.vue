<template>
    <DefinScrollbar height="100%" :showUpBt="true">
        <div class="page-container icon-list-view">
            <div class="container">
                <div
                    class="item"
                    v-for="(item, index) in dataContainer.iconList"
                    @click="onClick(item)"
                    :key="index"
                >
                    <SvgIcon :style="'width:23px;height:23px;'" :name="item.name"></SvgIcon>
                    <div class="name">
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
    </DefinScrollbar>
</template>

<script>
/**
 * 页面例子
 * 显示所有icon
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
} from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { iconList } from '@/components/svgIcon/common.js';
import DefinScrollbar from '@/components/definScrollbar.vue';
import { copyValue } from '@/common/otherTools';
import { messageSuccess } from '@/action/messagePrompt';

export default defineComponent({
    components: {
        SvgIcon,
        DefinScrollbar,
    },
    setup() {
        const dataContainer = reactive({
            iconList: iconList,
        });
        /** copy事件 */
        function onClick(item) {
            let msg = `<SvgIcon
:style="'width:23px;height:23px;'"
name="${item.name}"></SvgIcon>`;
            copyValue(msg);
            messageSuccess('复制成功');
        }
        return {
            dataContainer,
            onClick,
        };
    },
});
</script>

<style lang="scss" scoped>
.icon-list-view {
    display: flex;
    flex-direction: column;
    padding: var(--page-gap);
    box-sizing: border-box;
    > .container {
        padding: 15px;
        box-sizing: border-box;
        background-color: white;
        border-radius: 5px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-gap: 0 0;
        > .item {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 5px;
            padding: 15px;
            box-sizing: border-box;
            &:hover {
                background-color: rgb(231, 231, 231);
            }
            > .name {
                font-size: 15px;
                margin-top: 10px;
                text-align: center;
            }
        }
    }
}
</style>
