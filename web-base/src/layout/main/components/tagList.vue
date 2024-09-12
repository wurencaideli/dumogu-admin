<script>
/*
 * 标签切换按钮组件
 */
import {
    defineComponent,
    ref,
    reactive,
    computed,
    onMounted,
    watch,
    toRef,
    onUnmounted,
    nextTick,
} from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
/**
 * vuedraggable 文档
 * https://www.npmjs.com/package/vuedraggable/v/4.1.0
 *  */
import draggable from 'vuedraggable';
import { isPc } from '@/common/otherTools';
import generateTagListTools from '@/action/tagListTools';
import { userDataStore } from '@/store/user';
import { useRouter, useRoute } from 'vue-router';
import { toggleFullScreen } from '@/common/otherTools';

export default {
    name: 'TagList',
    components: {
        SvgIcon,
        draggable,
    },
    props: {
        /** 当前活动的唯一标识 */
        activePath: {
            type: [Number, String],
            default: 0,
        },
        /** 标签的分组名 */
        layoutName: {
            type: String,
            default: '',
        },
    },
    emits: ['onAdd'],
    setup(props, { emit }) {
        const router = useRouter();
        let userData = userDataStore();
        const ElScrollbarRef = ref(null);
        const TagListRef = ref(null);
        const RightOptionRef = ref(null);
        const dataContainer = reactive({
            tagList: toRef(userData, 'tagList'),
            activePath: toRef(props, 'activePath'),
            layoutName: toRef(props, 'layoutName'),
            show: false,
            location: {},
            show_1: false,
            isPc: isPc(), //是否是PC端
            activeItem: null,
        });
        /** 用来排序转换的数组，由外部确定是否转换 */
        const tagListTrans = computed({
            get() {
                return dataContainer.tagList.filter((item) => {
                    if (props.layoutName != item.layoutName) return false;
                    return true;
                });
            },
            set(value) {
                let list = dataContainer.tagList.filter((item) => {
                    if (props.layoutName != item.layoutName) return true;
                    return false;
                });
                userData.setTagList([...value, ...list]);
            },
        });
        /**
         * 鼠标滚动事件
         * 横向滚动标签页
         *  */
        function handleScroll(e) {
            if (!ElScrollbarRef.value) return;
            /** shift + 鼠标滚轮可以横向滚动 */
            if (e.shiftKey) return;
            let el = ElScrollbarRef.value.wrapRef;
            let scrollLeft = el.scrollLeft;
            if (e.deltaY < 0) {
                scrollLeft = scrollLeft - 30;
            } else {
                scrollLeft = scrollLeft + 30;
            }
            el.scrollLeft = scrollLeft;
        }
        /**
         * 自动滚动到相应标签
         * 防止标签没在视区
         */
        function autoScroll() {
            nextTick(() => {
                if (!ElScrollbarRef.value) return;
                let el = ElScrollbarRef.value.wrapRef;
                let target = el.querySelector('.item.active');
                if (!target) return;
                let rect = el.getBoundingClientRect();
                let rect_1 = target.getBoundingClientRect();
                if (rect_1.x < rect.x) {
                    // 表示在左边遮挡
                    let scroll = rect.x - rect_1.x;
                    el.scrollLeft = el.scrollLeft - scroll - 10;
                }
                if (rect_1.x + rect_1.width > rect.x + rect.width) {
                    // 表示在右边遮挡
                    let scroll = rect_1.x - (rect.x + rect.width);
                    el.scrollLeft = el.scrollLeft + scroll + rect_1.width + 10;
                }
            });
        }
        watch(toRef(props, 'activePath'), () => {
            autoScroll();
        });
        onMounted(() => {
            autoScroll();
        });
        /** 鼠标右击，展示自定义右击面板 */
        function handleClickContext(e, item) {
            if (!TagListRef.value) return;
            let el = TagListRef.value;
            let el_1 = e.target;
            let rect = el.getBoundingClientRect();
            let rect_1 = el_1.getBoundingClientRect();
            let location = {
                x: rect_1.x - rect.x,
                y: rect_1.y - rect.y + rect_1.height,
            };
            dataContainer.location = location;
            dataContainer.show = true;
            dataContainer.activeItem = item;
        }
        /** 初始化隐藏事件 */
        function initHiddenEvent() {
            function callbackFn(e) {
                dataContainer.show = false;
            }
            document.addEventListener('click', callbackFn);
            onUnmounted(() => {
                document.removeEventListener('click', callbackFn);
            });
        }
        initHiddenEvent();
        /** 初始化隐藏事件 */
        function initHiddenEvent_1() {
            function callbackFn(e) {
                if (!RightOptionRef.value) return;
                if (!e || !e.target) return;
                if (RightOptionRef.value.contains(e.target)) return;
                dataContainer.show_1 = false;
            }
            document.addEventListener('click', callbackFn);
            onUnmounted(() => {
                document.removeEventListener('click', callbackFn);
            });
        }
        initHiddenEvent_1();
        /**
         * tag 点击事件
         * 跳转到该标签的地址里，注意是完整地址
         *  */
        function handleTagClick(item) {
            if (!item || !item.fullPath) return;
            router.push(item.fullPath);
        }
        /** 操作事件 */
        function handleOptionClick(type, tagParams) {
            let tagTools = generateTagListTools(dataContainer.layoutName);
            tagParams = tagParams || {};
            let tag, path;
            switch (true) {
                /** 跳转去右边标签 */
                case type == 'handleToRight':
                    tag = tagTools.getRight(dataContainer.activePath);
                    handleTagClick(tag);
                    break;
                /** 跳转去左边标签 */
                case type == 'handleToLeft':
                    tag = tagTools.getLeft(dataContainer.activePath);
                    handleTagClick(tag);
                    break;
                /** 删除一个标签 */
                case type == 'handleTagRemove':
                    if (tagListTrans.value.length == 0) return;
                    tagTools.deleteTags(tagParams.path);
                    if (dataContainer.activePath == tagParams.path) {
                        tag = tagTools.getLatelyHisTag();
                        handleTagClick(tag);
                    }
                    break;
                /** 切换标签状态 */
                case type == 'handleSwitchCache':
                    if (!tagParams.path) return;
                    tagTools.updateTag(
                        Object.assign(tagParams, {
                            isCache: !tagParams.isCache,
                        }),
                    );
                    break;
                /** 切换标签状态 */
                case type == 'handleSwitchFixed':
                    if (!tagParams.path) return;
                    tagTools.updateTag(
                        Object.assign(tagParams, {
                            fixed: !tagParams.fixed,
                        }),
                    );
                    break;
                case type == 'handleRefresh':
                    if (!tagParams.path) return;
                    tagTools.refreshTag(tagParams.path);
                    break;
                case type == 'handleAdd':
                    path = `/main/new-tag-page/${new Date().getTime()}`;
                    router.push(path);
                    break;
                case type == 'handleDeleteOtherTags':
                    tagTools.deleteOtherTags(dataContainer.activePath);
                    break;
                case type == 'handleDeleteLeftTags':
                    tagTools.deleteLeftTags(dataContainer.activePath);
                    break;
                case type == 'handleDeleteRightTags':
                    tagTools.deleteRightTags(dataContainer.activePath);
                    break;
                case type == 'handleRefreshAll':
                    tagTools.refreshTag(dataContainer.activePath, true);
                    break;
            }
        }
        return {
            dataContainer,
            handleOptionClick,
            tagListTrans,
            handleScroll,
            ElScrollbarRef,
            handleClickContext,
            TagListRef,
            RightOptionRef,
            handleTagClick,
            toggleFullScreen,
        };
    },
};
</script>

<template>
    <div class="tag-list-cp-container" ref="TagListRef">
        <div class="left" @wheel="handleScroll">
            <el-scrollbar ref="ElScrollbarRef" height="100%">
                <draggable
                    class="scrollbar-container"
                    item-key="sign"
                    :disabled="!dataContainer.isPc"
                    v-model="tagListTrans"
                >
                    <template #item="{ element }">
                        <div
                            :class="{
                                item: true,
                                active: dataContainer.activePath == element.path,
                            }"
                            @click="handleTagClick(element)"
                            @contextmenu.prevent="
                                (e) => {
                                    handleClickContext(e, element);
                                }
                            "
                        >
                            <SvgIcon
                                class="sign icon-sign"
                                v-if="element.showTagIcon && element.iconName"
                                :style="'width: 15px;min-width:15px;height: 15px;'"
                                :name="element.iconName"
                            ></SvgIcon>
                            {{ element.title }}
                            <div
                                v-if="!element.fixed && tagListTrans.length > 1"
                                @click.stop="handleOptionClick('handleTagRemove', element)"
                                class="bt"
                            >
                                <SvgIcon
                                    :style="'width:12px;height:12px;'"
                                    name="svg:times.svg"
                                ></SvgIcon>
                            </div>
                            <div v-if="element.isCache" class="cache"></div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="item add-bt" @click="handleOptionClick('handleAdd')">
                            <SvgIcon
                                :style="'width:16px;height:16px;'"
                                name="svg:plus.svg"
                            ></SvgIcon>
                        </div>
                    </template>
                </draggable>
            </el-scrollbar>
        </div>
        <div class="bt-list">
            <div
                class="bt"
                @click="
                    handleOptionClick('handleRefresh', {
                        path: dataContainer.activePath,
                    })
                "
            >
                <SvgIcon :style="'width:15px;height:15px;'" name="svg:redo.svg"></SvgIcon>
            </div>
            <div class="bt" @click="handleOptionClick('handleToLeft', dataContainer.activeItem)">
                <SvgIcon :style="'width:15px;height:15px;'" name="svg:arrow-left.svg"></SvgIcon>
            </div>
            <div class="bt" @click="handleOptionClick('handleToRight', dataContainer.activeItem)">
                <SvgIcon :style="'width:15px;height:15px;'" name="svg:arrow-right.svg"></SvgIcon>
            </div>
        </div>
        <div ref="RightOptionRef" class="right">
            <div
                @click="
                    () => {
                        dataContainer.show_1 = !dataContainer.show_1;
                    }
                "
                class="bt"
            >
                <SvgIcon :style="'width:20px;height:20px;'" name="svg:gallery-view.svg"></SvgIcon>
            </div>
            <div
                :class="{
                    'bt-list-container': true,
                    show: dataContainer.show_1,
                }"
            >
                <div class="item" @click="handleOptionClick('handleRefreshAll')">
                    <SvgIcon
                        :style="'width:16px;height:16px;color:#0072E5;'"
                        name="svg:redo.svg"
                    ></SvgIcon>
                    刷新所有标签页
                </div>
                <div
                    v-if="dataContainer.tagList.length > 1"
                    class="item"
                    @click="handleOptionClick('handleDeleteOtherTags')"
                >
                    <SvgIcon
                        :style="'width:16px;height:16px;color:#f86464;'"
                        name="svg:borderverticle-fill.svg"
                    ></SvgIcon>
                    关闭其他标签页
                </div>
                <div
                    v-if="dataContainer.tagList.length > 1"
                    class="item"
                    @click="handleOptionClick('handleDeleteLeftTags')"
                >
                    <SvgIcon
                        :style="'width:16px;height:16px;color:#f86464;'"
                        name="svg:arrow-left.svg"
                    ></SvgIcon>
                    关闭左边标签页
                </div>
                <div
                    v-if="dataContainer.tagList.length > 1"
                    class="item"
                    @click="handleOptionClick('handleDeleteRightTags')"
                >
                    <SvgIcon
                        :style="'width:16px;height:16px;color:#f86464;'"
                        name="svg:arrow-right.svg"
                    ></SvgIcon>
                    关闭右边标签页
                </div>
            </div>
        </div>
        <div @click="toggleFullScreen" class="bt">
            <SvgIcon :style="'width:25px;height:25px;'" name="svg:Navbar-full.svg"></SvgIcon>
        </div>
        <div
            :style="{
                left: `${dataContainer.location.x || 0}px`,
                top: `${dataContainer.location.y || 0}px`,
            }"
            :class="{
                'bt-list-container': true,
                show: dataContainer.show,
            }"
        >
            <div
                class="item re-bt"
                @click="handleOptionClick('handleRefresh', dataContainer.activeItem)"
            >
                <SvgIcon
                    :style="'width:16px;height:16px;color:#0072E5;'"
                    name="svg:redo.svg"
                ></SvgIcon>
                刷新此标签页
            </div>
            <div
                class="item"
                @click="handleOptionClick('handleSwitchCache', dataContainer.activeItem)"
            >
                <SvgIcon :style="'width:16px;height:16px;'" name="svg:switch.svg"></SvgIcon>
                切换缓存状态
            </div>
            <div
                class="item"
                @click="handleOptionClick('handleSwitchFixed', dataContainer.activeItem)"
            >
                <SvgIcon :style="'width:16px;height:16px;'" name="svg:nail.svg"></SvgIcon>
                切换固定状态
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tag-list-cp-container {
    height: 100%;
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--text-color);
    --item-gap: 10px;
    padding: 0 var(--item-gap) 0 0;
    > .left {
        flex: 1 1 0;
        width: 0;
        height: 100%;
        mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 10px), transparent);
        :deep(.el-scrollbar__bar) {
            &.is-horizontal {
                height: 5px !important;
                opacity: 0.5;
            }
        }
        :deep(.el-scrollbar__view) {
            height: 100%;
        }
        :deep(.scrollbar-container) {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: fit-content;
            height: 100%;
            padding: 0 var(--item-gap);
            box-sizing: border-box;
            .item {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 5px 8px;
                box-sizing: border-box;
                margin: 0 10px 0 0;
                font-size: 13px;
                height: 30px;
                width: max-content;
                border-radius: 5px;
                color: var(--text-color);
                position: relative;
                transition: all 0.2s;
                opacity: 0.5;
                &.active {
                    background-color: #5340ff;
                    color: var(--text-color-2);
                    font-weight: bold;
                    opacity: 1;
                }
                &:hover {
                    background-color: #5340ff;
                    opacity: 1;
                }
                > .sign {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #5240ff;
                    margin-right: 5px;
                    &.icon-sign {
                        background-color: transparent;
                    }
                }
                > .bt {
                    width: fit-content;
                    height: fit-content;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-left: 5px;
                    transition: all 0.2s;
                    &:hover {
                        color: red;
                    }
                }
                > .cache {
                    width: 30%;
                    max-width: 30px;
                    min-width: 15px;
                    height: 3px;
                    border-radius: 999px;
                    background-color: rgba(255, 255, 255, 0.397);
                    position: absolute;
                    bottom: 0;
                }
            }
            .add-bt {
                width: 30px;
                background-color: rgb(0, 0, 0);
                border-radius: 50%;
                padding: 0;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: rgb(202, 202, 202);
            }
        }
    }
    > .bt-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0px 0 0px;
        box-sizing: border-box;
        // border-left: 1px solid var(--border-color);
        height: 100%;
        > * {
            margin: 0 var(--item-gap) 0 0;
            &:first-child {
                margin-left: var(--item-gap);
            }
            &:last-child {
                margin: 0;
            }
        }
    }
    .bt {
        cursor: pointer;
        transition: all 0.2s;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &:hover {
            color: #5240ff;
        }
    }
    > .right {
        padding: 0 var(--item-gap);
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;
        > .bt {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
                color: #5240ff;
            }
        }
        > .bt-list-container {
            top: calc(100% + 0px);
            right: var(--item-gap);
        }
    }
    .bt-list-container {
        min-width: 150px;
        display: flex;
        flex-direction: column;
        position: absolute;
        width: max-content;
        z-index: 9;
        background-color: #1f1f23;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0px 4px rgba(0, 0, 0, 0.4);
        padding: 20px 0;
        box-sizing: border-box;
        border-radius: 12px;
        border: 1px solid #ffffff12;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
        transform: scale(0);
        &.show {
            opacity: 1;
            pointer-events: initial;
            transform: scale(1);
        }
        > .item {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding: 15px 10px;
            box-sizing: border-box;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            color: rgb(206, 206, 206);
            border-bottom: 1px solid #ffffff12;
            border-left: none;
            border-right: none;
            > * {
                margin-right: 10px;
            }
            &:hover {
                background-color: rgba(145, 145, 162, 0.17);
                color: #007fff;
            }
            &:first-child {
                border-top: 1px solid #ffffff12;
            }
            &.logout {
                color: #c95050;
            }
        }
    }
}
</style>
