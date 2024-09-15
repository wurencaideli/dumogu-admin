<template>
    <div></div>
</template>

<script>
/**
 * 路由的跳转重定向页面
 */
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'Redirect',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { params, query } = route;
        const { path } = params;
        router.replace(path);
        return {};
    },
};
</script>
