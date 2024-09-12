<script>
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'; //启用element 中文
import { publicDataStore } from '@/store/public';
import { loadScript } from '@/common/otherTools';

export default defineComponent({
    components: {
        ElConfigProvider,
    },
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
            locale: zhCn,
        };
    },
});
</script>

<template>
    <el-config-provider :locale="locale">
        <router-view v-slot="{ Component }">
            <transition name="el-fade-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </el-config-provider>
</template>
