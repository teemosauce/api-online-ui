<template>
    <h1 class="title">欢迎来到 {{ appTitle }}</h1>
    <h3 class="desc">在这里，您将可以在线编写、测试以及使用您的API</h3>
    <nx-button @click="goWorkspace">前往工作空间</nx-button>
</template>

<script setup lang="ts">
import { NxButton } from 'naive-ui'
import { useRouter } from 'vue-router';

const appTitle = import.meta.env.VITE_APP_TITLE
const router = useRouter()

function goWorkspace() {
    router.push({
        path: '/dashboard'
    })
}
</script>

<style scoped>
.title {
    color: white;
}

.desc {
    color: #fefefe;
}
</style>