<template>
    <div class="layout">
        <div class="left">
            <div>
                <router-link to="/dashboard">首页</router-link>
            </div>
            <div>
                <router-link to="/api/list">API列表</router-link>
            </div>

            <div>
                <router-link to="/api/create">新建API</router-link>
            </div>

        </div>
        <div class="main">
            子路由区域
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">



</script>

<style scoped lang="scss">
.layout {
    display: flex;
    flex: 1;


    .left {
        width: 200px;
    }

    .main {
        flex: 1;
    }
}
</style>