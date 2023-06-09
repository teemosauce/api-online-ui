

<script setup lang="ts">
import { list as listApi, test as testApi } from '@api/api'
import { useAppStore } from '@store/app'
const appStore = useAppStore()
let data = reactive({
    apiList: <Array<APIModel>>[],
    result: ''
});
let Message = useMessage()
async function queryApiList() {
    try {
        data.apiList = await listApi(appStore.workspace.name)
        console.log(data.apiList)
    } catch (err: any) {
        console.error(err)
        data.apiList = []
        Message.error(err.message)
    }
}

onMounted(() => {
    queryApiList()
})


async function testMyApi(item: APIModel) {
    try {
        let result = await testApi(appStore.workspace.name, item, {

        })

        if (typeof result == 'object') {
            result = JSON.stringify(result)
        }
        data.result = <string>result

    } catch (err: any) {
        Message.error(err.message)
    }
}

</script>

<template>
    API列表
    <div v-for="item in data.apiList" :key="item.url">
        {{ item.method }} {{ item.url }} {{ item.code }}
        <n-button @click="testMyApi(item)">测试</n-button>
    </div>
    测试结果：
    <div>{{ data.result }}</div>
</template>