<template>
    <div></div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'Redirect',
    setup(props) {
        const route = useRoute();
        const router = useRouter();
        const { params, query } = route;
        const { path } = params;
        router.replace({ path: path, query });
        return {};
    },
};
</script>
