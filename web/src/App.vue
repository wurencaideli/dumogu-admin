<script>
import { defineComponent,ref,getCurrentInstance,reactive,nextTick, computed,onMounted } from "vue";
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';  //启用element 中文
import {publicData as publicDataStore} from "@/store/Public";
import {loadScript,isPc} from "@/common/OtherTools";
import {friendLinkList} from "@/common/Const";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute,useRouter } from 'vue-router';

export default defineComponent({
    components: {
        ElConfigProvider,
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const publicData = publicDataStore();
        /** 
         * 获取友情链接
         * 储存在毒蘑菇变量中
         * var.dumogu.top
         * https://var.dumogu.top/var/update?id=qdmp3dmX3
         *  */
        setTimeout(()=>{
            loadScript('https://dumogu-web-var.oss-cn-chengdu.aliyuncs.com/qdmp3dmX3.js','js').then(()=>{
                let data = window.$dumogu_search_data || {};
                let list = data.friendlink || [];
                if(!Array.isArray(list)) return;
                list = list.filter(item=>{
                    return item.name && item.url;
                });
                publicData.setFriendLinkList([
                    ...friendLinkList,
                    ...list,
                ]);
            });
            publicData.setFriendLinkList([
                ...friendLinkList,
            ]);
        },150);
        onMounted(()=>{
            setTimeout(()=>{
                if(isPc()) return;
                if(route.name == 'MMain') return;
                ElMessageBox.confirm(
                    '检测到移动端设备，跳转到移动版页面',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    },
                ).then(() => {
                    router.push('/m');
                }).catch(()=>{});
            },700);
        });
        return {
            locale: zhCn,
        };
    },
});
</script>

<template>
<el-config-provider :locale="locale">
    <el-scrollbar 
        height="100vh">
        <router-view v-slot="{ Component }">
            <component 
                :is="Component" />
        </router-view>
    </el-scrollbar>
</el-config-provider>
</template>

<style scoped></style>
