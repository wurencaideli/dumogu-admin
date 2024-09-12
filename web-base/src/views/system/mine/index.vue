<template>
    <div class="page-container mine-view">
        <div class="container">
            <el-image class="img" :src="dataContainer.userInfo.avatar" fit="cover" />
            <div class="content">
                <div class="item">
                    <div class="left">
                        <SvgIcon
                            :style="'width:16px;height:16px;margin-right:5px;'"
                            name="svg:user-fill.svg"
                        ></SvgIcon>
                        用户名称
                    </div>
                    <div class="right">
                        {{ dataContainer.userInfo.nickName }}
                    </div>
                </div>
                <div class="item">
                    <div class="left">
                        <SvgIcon
                            :style="'width:16px;height:16px;margin-right:5px;'"
                            name="svg:laptop.svg"
                        ></SvgIcon>
                        手机号码
                    </div>
                    <div class="right">
                        {{ dataContainer.userInfo.nickName }}
                    </div>
                </div>
                <div class="item">
                    <div class="left">
                        <SvgIcon
                            :style="'width:16px;height:16px;margin-right:5px;'"
                            name="svg:commentdots-fill.svg"
                        ></SvgIcon>
                        用户邮件
                    </div>
                    <div class="right">
                        {{ dataContainer.userInfo.nickName }}
                    </div>
                </div>
                <div class="item">
                    <div class="left">
                        <SvgIcon
                            :style="'width:16px;height:16px;margin-right:5px;'"
                            name="svg:compress-alt.svg"
                        ></SvgIcon>
                        所属部门
                    </div>
                    <div class="right">
                        {{ dataContainer.userInfo.nickName }}
                    </div>
                </div>
            </div>
            <router-link class="bt" to="/main/mine/info-update">
                <SvgIcon :style="'width:16px;height:16px;'" name="svg:cog-fill.svg"></SvgIcon>
            </router-link>
        </div>
    </div>
</template>

<script>
/**
 * 个人信息展示
 */
import {
    defineComponent,
    onBeforeUnmount,
    ref,
    reactive,
    getCurrentInstance,
    onActivated,
    toRef,
} from 'vue';
import SvgIcon from '@/components/svgIcon/index.vue';
import { userDataStore } from '@/store/user';

export default defineComponent({
    components: {
        SvgIcon,
    },
    setup() {
        let userData = userDataStore();
        const dataContainer = reactive({
            userInfo: toRef(userData, 'userInfo'),
        });
        return {
            dataContainer,
        };
    },
});
</script>

<style lang="scss" scoped>
.mine-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    > .container {
        width: 100%;
        max-width: 500px;
        padding: 30px 15px 15px 15px;
        box-sizing: border-box;
        background-color: white;
        border-radius: 5px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: column;
        position: relative;
        > .img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-bottom: 30px;
            border: 2px solid rgba(0, 0, 0, 0.421);
        }
        > .content {
            width: 100%;
            border-radius: 5px;
            background-color: rgb(238, 238, 238);
            padding: 0 0;
            box-sizing: border-box;
            > .item {
                width: 100%;
                padding: 15px;
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                border-bottom: 1px solid rgb(214, 214, 214);
                color: #4a4a4a;
                &:last-child {
                    border: none;
                }
                > .left {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    opacity: 0.7;
                }
                > .right {
                    width: 0;
                    flex: 1 1 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
            }
        }
        > .bt {
            position: absolute;
            right: 15px;
            top: 15px;
        }
    }
}
</style>
