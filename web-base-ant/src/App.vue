<script>
import { defineComponent } from 'vue';
import { publicDataStore } from '@/store/public';
import { loadScript } from '@/common/otherTools';
import { theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

export default defineComponent({
    components: {},
    setup() {
        const publicData = publicDataStore();
        /**
         * 获取友情链接
         * 储存在毒蘑菇变量中
         * var.dumogu.top
         * https://var.dumogu.top/var/update?id=qdmp3dmX3
         *  */
        setTimeout(() => {
            loadScript(
                'https://dumogu-web-var.oss-cn-chengdu.aliyuncs.com/qdmp3dmX3.js',
                'js',
            ).then(() => {
                let data = window.$dumogu_search_data || {};
                let list = data.friendlink || [];
                if (!Array.isArray(list)) return;
                list = list.filter((item) => {
                    return item.name && item.url;
                });
                publicData.setFriendLinkList([...list]);
            });
            publicData.setFriendLinkList([]);
        }, 150);
        /** 阻止默认的拖拽事件 */
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        return {
            locale: zhCN,
            theme,
        };
    },
});
</script>

<template>
    <a-config-provider
        :theme="{
            algorithm: theme.darkAlgorithm,
        }"
        :locale="locale"
    >
        <router-view v-slot="{ Component }">
            <transition name="el-fade-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </a-config-provider>
</template>
