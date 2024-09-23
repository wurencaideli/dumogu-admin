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
import { deepCopyObj, isPc } from '@/common/otherTools';
import {
    findTag,
    getTag,
    deleteTags,
    updateTag,
    refreshTag,
    deleteOtherTags,
    deleteLeftTags,
    deleteRightTags,
    getLatelyHisTag,
    getRight,
    getLeft,
} from '@/action/tagListTools';
import { userDataStore } from '@/store/user';
import { publicDataStore } from '@/store/public';
import { useRouter, useRoute } from 'vue-router';
import { toggleFullScreen } from '@/common/otherTools';
import definDropdown from '@/components/definDropdown.vue';

export default defineComponent({
    name: 'TagList',
    components: {
        SvgIcon,
        draggable,
        definDropdown,
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
        let publicData = publicDataStore();
        const ElScrollbarRef = ref(null);
        const dataContainer = reactive({
            tagsMap: toRef(userData, 'tagsMap'),
            fullScreen: toRef(publicData, 'fullScreen'),
            activePath: toRef(props, 'activePath'),
            layoutName: toRef(props, 'layoutName'),
            show: false,
            location: {},
            show_1: false,
            showLeft: false,
            showRight: false,
            isPc: isPc(), //是否是PC端
            activeItem: null,
        });
        /** 用来排序转换的数组，由外部确定是否转换 */
        const tagListTrans = computed({
            get() {
                let tagList = dataContainer.tagsMap[dataContainer.layoutName || ''];
                return tagList || [];
            },
            set(value) {
                dataContainer.tagsMap[dataContainer.layoutName || ''] = value;
                userData.setTagsMap(dataContainer.tagsMap);
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
            let el = ElScrollbarRef.value;
            let scrollLeft = el.scrollLeft;
            if (e.deltaY < 0) {
                scrollLeft = scrollLeft - 30;
            } else {
                scrollLeft = scrollLeft + 30;
            }
            el.scrollLeft = scrollLeft;
        }
        /** 滚动容器滚动事件 */
        function handleScroll_1() {
            if (!ElScrollbarRef.value) return;
            dataContainer.showLeft = false;
            dataContainer.showRight = false;
            let el = ElScrollbarRef.value;
            let scrollRight = el.scrollWidth - el.clientWidth - el.scrollLeft;
            if (el.scrollLeft >= 5) {
                dataContainer.showLeft = true;
            }
            if (scrollRight >= 5) {
                dataContainer.showRight = true;
            }
        }
        /**
         * 自动滚动到相应标签
         * 防止标签没在视区
         */
        function autoScroll() {
            nextTick(() => {
                if (!ElScrollbarRef.value) return;
                let el = ElScrollbarRef.value;
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
        function handleClickContext(item) {
            setTimeout(() => {
                dataContainer.show = true;
                dataContainer.activeItem = item;
            }, 0);
        }
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
            tagParams = deepCopyObj(tagParams || {});
            let tag, path;
            switch (true) {
                /** 跳转去右边标签 */
                case type == 'handleToRight':
                    tag = getRight({ path: tagParams.path, layoutName: dataContainer.layoutName });
                    handleTagClick(tag);
                    break;
                /** 跳转去左边标签 */
                case type == 'handleToLeft':
                    tag = getLeft({ path: tagParams.path, layoutName: dataContainer.layoutName });
                    handleTagClick(tag);
                    break;
                /** 删除一个标签 */
                case type == 'handleTagRemove':
                    if (tagListTrans.value.length <= 1) return;
                    deleteTags({
                        paths: tagParams.path,
                        layoutName: dataContainer.layoutName,
                    });
                    if (dataContainer.activePath == tagParams.path) {
                        tag = getLatelyHisTag({ layoutName: dataContainer.layoutName });
                        handleTagClick(tag);
                    }
                    break;
                /** 切换标签状态 */
                case type == 'handleSwitchCache':
                    if (!tagParams.path) return;
                    updateTag({
                        layoutName: dataContainer.layoutName,
                        tag: Object.assign(tagParams, {
                            isCache: !tagParams.isCache,
                        }),
                    });
                    break;
                /** 切换标签状态 */
                case type == 'handleSwitchFixed':
                    if (!tagParams.path) return;
                    updateTag({
                        layoutName: dataContainer.layoutName,
                        tag: Object.assign(tagParams, {
                            fixed: !tagParams.fixed,
                        }),
                    });
                    break;
                case type == 'handleRefresh':
                    if (!tagParams.path) return;
                    refreshTag({ path: tagParams.path, layoutName: dataContainer.layoutName });
                    break;
                case type == 'handleAdd':
                    path = `/main/new-tag-page/${new Date().getTime()}`;
                    router.push(path);
                    break;
                case type == 'handleDeleteOtherTags':
                    deleteOtherTags({
                        path: tagParams.path,
                        layoutName: dataContainer.layoutName,
                        excludePaths: tagParams.excludePaths || [],
                    });
                    break;
                case type == 'handleDeleteLeftTags':
                    deleteLeftTags({ path: tagParams.path, layoutName: dataContainer.layoutName });
                    break;
                case type == 'handleDeleteRightTags':
                    deleteRightTags({ path: tagParams.path, layoutName: dataContainer.layoutName });
                    break;
                case type == 'handleRefreshAll':
                    refreshTag({
                        path: tagParams.path,
                        layoutName: dataContainer.layoutName,
                        refreshAll: true,
                    });
                    break;
                case type == 'handleNewOpen':
                    tag = tagParams;
                    if (tag && tag.fullPath) {
                        let routeUrl = router.resolve(tag.fullPath);
                        window.open(routeUrl.href, '_blank');
                    }
                    break;
            }
        }
        function toggleFullScreen_1() {
            publicData.setFullScreen(!dataContainer.fullScreen);
        }
        return {
            dataContainer,
            handleOptionClick,
            tagListTrans,
            handleScroll,
            ElScrollbarRef,
            handleClickContext,
            handleTagClick,
            toggleFullScreen,
            handleScroll_1,
            toggleFullScreen_1,
        };
    },
});
</script>

<template>
    <div class="tag-list-cp-container">
        <div
            :class="{
                left: true,
                'show-right': dataContainer.showRight,
                'show-left': dataContainer.showLeft,
            }"
            @wheel="handleScroll"
        >
            <definDropdown
                :show="dataContainer.show"
                :ifLeftClick="false"
                :targetQuery="'.target'"
                @onOtherClick="
                    () => {
                        dataContainer.show = false;
                        dataContainer.activeItem = null;
                    }
                "
                position="outside,bottom,start"
            >
                <div class="scrollbar no-scrollbar" @scroll="handleScroll_1" ref="ElScrollbarRef">
                    <draggable
                        class="scrollbar-container"
                        item-key="path"
                        :disabled="!dataContainer.isPc"
                        v-model="tagListTrans"
                    >
                        <template #item="{ element }">
                            <div
                                :class="{
                                    target: true,
                                    item: true,
                                    active: dataContainer.activePath == element.path,
                                    'is-select':
                                        dataContainer.activeItem &&
                                        dataContainer.activeItem.path == element.path,
                                }"
                                @click="handleTagClick(element)"
                                @contextmenu.prevent="handleClickContext(element)"
                            >
                                <SvgIcon
                                    class="sign icon-sign"
                                    v-if="element.showTagIcon && element.iconName"
                                    :style="'width: 15px;min-width:15px;height: 15px;'"
                                    :name="element.iconName"
                                ></SvgIcon>
                                {{ element.title || '未知标签' }}
                                <SvgIcon
                                    v-if="element.fixed"
                                    :style="'width: 12px;min-width:12px;height: 12px;margin-left:5px;opacity: 0.8;'"
                                    :name="'svg:nail.svg'"
                                ></SvgIcon>
                                <div
                                    v-if="!element.fixed && tagListTrans.length > 1"
                                    @click.stop="handleOptionClick('handleTagRemove', element)"
                                    class="bt"
                                >
                                    <SvgIcon
                                        :style="'width:10px;height:10px;color:rgb(248, 86, 86);'"
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
                </div>
                <template v-slot:dropdown>
                    <div class="bt-list-container">
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
                            @click="
                                handleOptionClick('handleSwitchCache', dataContainer.activeItem)
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;'"
                                name="svg:switch.svg"
                            ></SvgIcon>
                            切换缓存状态
                        </div>
                        <div
                            class="item"
                            @click="
                                handleOptionClick('handleSwitchFixed', dataContainer.activeItem)
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;'"
                                name="svg:nail.svg"
                            ></SvgIcon>
                            切换固定状态
                        </div>
                        <div
                            class="item"
                            @click="handleOptionClick('handleNewOpen', dataContainer.activeItem)"
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;'"
                                name="svg:paper-plane.svg"
                            ></SvgIcon>
                            在新窗口打开
                        </div>
                        <div
                            v-if="tagListTrans.length > 1"
                            class="item"
                            @click="
                                handleOptionClick('handleDeleteOtherTags', {
                                    path: dataContainer.activeItem.path,
                                    excludePaths: [dataContainer.activePath],
                                })
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;color:#f86464;'"
                                name="svg:borderverticle-fill.svg"
                            ></SvgIcon>
                            关闭其他标签页
                        </div>
                    </div>
                </template>
            </definDropdown>
        </div>
        <div class="right">
            <div
                class="bt"
                @click="
                    handleOptionClick('handleToLeft', {
                        path: dataContainer.activePath,
                    })
                "
            >
                <SvgIcon :style="'width:18px;height:18px;'" name="svg:arrow-left.svg"></SvgIcon>
            </div>
            <div
                class="bt"
                @click="
                    handleOptionClick('handleToRight', {
                        path: dataContainer.activePath,
                    })
                "
            >
                <SvgIcon :style="'width:18px;height:18px;'" name="svg:arrow-right.svg"></SvgIcon>
            </div>
            <div
                class="bt"
                @click="
                    handleOptionClick('handleRefresh', {
                        path: dataContainer.activePath,
                    })
                "
            >
                <SvgIcon :style="'width:18px;height:18px;'" name="svg:redo.svg"></SvgIcon>
            </div>
            <definDropdown
                :show="dataContainer.show_1"
                :ifLeftClick="true"
                :targetQuery="'.target'"
                @onOtherClick="dataContainer.show_1 = false"
                @onClick="
                    () => {
                        dataContainer.show_1 = !dataContainer.show_1;
                    }
                "
                position="outside,bottom,end"
            >
                <div class="bt target">
                    <SvgIcon
                        :style="'width:20px;height:20px;'"
                        name="svg:gallery-view.svg"
                    ></SvgIcon>
                </div>
                <template v-slot:dropdown>
                    <div class="bt-list-container">
                        <div
                            class="item"
                            @click="
                                handleOptionClick('handleRefreshAll', {
                                    path: dataContainer.activePath,
                                })
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;color:#0072E5;'"
                                name="svg:redo.svg"
                            ></SvgIcon>
                            刷新所有标签页
                        </div>
                        <div
                            v-if="tagListTrans.length > 1"
                            class="item"
                            @click="
                                handleOptionClick('handleDeleteOtherTags', {
                                    path: dataContainer.activePath,
                                })
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;color:#f86464;'"
                                name="svg:borderverticle-fill.svg"
                            ></SvgIcon>
                            关闭其他标签页
                        </div>
                        <div
                            v-if="tagListTrans.length > 1"
                            class="item"
                            @click="
                                handleOptionClick('handleDeleteLeftTags', {
                                    path: dataContainer.activePath,
                                })
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;color:#f86464;'"
                                name="svg:arrow-left.svg"
                            ></SvgIcon>
                            关闭左边标签页
                        </div>
                        <div
                            v-if="tagListTrans.length > 1"
                            class="item"
                            @click="
                                handleOptionClick('handleDeleteRightTags', {
                                    path: dataContainer.activePath,
                                })
                            "
                        >
                            <SvgIcon
                                :style="'width:16px;height:16px;color:#f86464;'"
                                name="svg:arrow-right.svg"
                            ></SvgIcon>
                            关闭右边标签页
                        </div>
                    </div>
                </template>
            </definDropdown>
            <!-- <div @click="toggleFullScreen_1" class="bt">
                <SvgIcon
                    :style="'width:20px;height:20px;'"
                    :name="dataContainer.fullScreen ? 'svg:compress-alt.svg' : 'svg:expand-alt.svg'"
                ></SvgIcon>
            </div>
            <div @click="toggleFullScreen" class="bt">
                <SvgIcon :style="'width:25px;height:25px;'" name="svg:Navbar-full.svg"></SvgIcon>
            </div> -->
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
    :deep(.defin-drop) {
        height: 100% !important;
        width: 100% !important;
        > .defin-drop-target {
            height: 100% !important;
            width: 100% !important;
        }
    }
    > .left {
        flex: 1 1 0;
        width: 0;
        height: 100%;
        position: relative;
        margin-right: var(--item-gap);
        &.show-left {
            &::after {
                opacity: 1;
            }
        }
        &.show-right {
            &::before {
                opacity: 1;
            }
        }
        &::after {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            content: ' ';
            position: absolute;
            left: 0;
            top: 0;
            width: var(--item-gap);
            height: 100%;
            background-image: linear-gradient(to right, #ffffff, transparent);
            z-index: 9;
        }
        &::before {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            content: ' ';
            position: absolute;
            right: 0;
            top: 0;
            width: var(--item-gap);
            height: 100%;
            background-image: linear-gradient(to right, transparent, #ffffff);
            z-index: 9;
        }
        :deep(.scrollbar) {
            width: 100%;
            height: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            .scrollbar-container {
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
                    padding: 5px 10px;
                    box-sizing: border-box;
                    margin: 0 10px 0 0;
                    font-size: 12px;
                    font-weight: bold;
                    height: 30px;
                    width: max-content;
                    border-radius: 5px;
                    color: var(--text-color);
                    position: relative;
                    transition: all 0.2s;
                    opacity: 0.8;
                    --bt-width: 20px;
                    --bt-width-1: calc(var(--bt-width) / 2);
                    &:last-child {
                        margin: 0;
                    }
                    &.active {
                        background-color: #5340ff;
                        color: white;
                        font-weight: bold;
                        opacity: 1;
                        box-shadow: var(--box-shadow-2);
                    }
                    &.is-select {
                        box-shadow: inset 0 0 0 2px #5340ff !important;
                    }
                    &:hover {
                        background-color: #5340ff;
                        color: white;
                        box-shadow: var(--box-shadow-2);
                        > .bt {
                            opacity: 1;
                            width: var(--bt-width);
                            right: calc(0px - var(--bt-width-1));
                        }
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
                        opacity: 0;
                        width: 0;
                        height: var(--bt-width);
                        border-radius: 100%;
                        display: flex;
                        position: absolute;
                        right: 0;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        transition: all 0.2s;
                        border: 2px solid rgb(248, 86, 86);
                        box-sizing: border-box;
                        &:hover {
                            color: red;
                            border: 2px solid red;
                        }
                    }
                    > .cache {
                        width: 30%;
                        max-width: 30px;
                        min-width: 15px;
                        height: 3px;
                        border-radius: 999px;
                        background-color: rgb(237, 237, 237);
                        position: absolute;
                        bottom: -1px;
                        box-shadow: var(--box-shadow-2);
                    }
                }
                .add-bt {
                    width: 30px;
                    height: 30px;
                    background-color: rgba(0, 0, 0, 0.219);
                    border-radius: 50%;
                    padding: 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    color: var(--text-color);
                    border: 2px solid #7768ff;
                    &:hover {
                        background-color: #5340ff;
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
            }
        }
    }
    > .right {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 0px 0 0px;
        box-sizing: border-box;
        height: 100%;
        > * {
            margin: 0 0 0 15px;
            &:first-child {
                margin: 0;
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
            color: var(--text-color);
            &:hover {
                color: #4f3bff;
            }
        }
    }
}
</style>
