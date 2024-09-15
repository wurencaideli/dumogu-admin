<script>
import { defineComponent } from 'vue';
import { NConfigProvider } from 'naive-ui';
import { zhCN, dateZhCN } from 'naive-ui';
import { darkTheme } from 'naive-ui';

export default defineComponent({
    components: {
        NConfigProvider,
    },
    setup() {
        /** 阻止默认的拖拽事件 */
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        return {
            zhCN,
            dateZhCN,
            darkTheme,
        };
    },
});
</script>

<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="darkTheme">
        <n-dialog-provider>
            <n-message-provider>
                <router-view v-slot="{ Component }">
                    <transition name="el-fade-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>
