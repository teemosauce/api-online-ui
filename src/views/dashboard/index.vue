<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NxButton } from 'naive-ui'
import { list, APIModel } from '@api/api'


let count = ref(100);
let apiList: Array<APIModel> = reactive([]);
let error = ref('')

function handleClick() {
    count.value++
}

async function listAPI() {
    try {
        apiList = await list('xyoFHPWSLqboVSw_Quyzi')
        console.log(apiList)
        error.value = JSON.stringify(apiList)
    } catch (err: any) {
        console.error(error)
        error.value = err.message
    }

}

</script>

<template>
    <button @click="handleClick">+</button>
    <div>{{ count }}</div>
    <nx-button @click="listAPI">GET API</nx-button>

    <div v-if="apiList.length > 0">
        <div v-for="item in apiList" :key="item.handler">
            {{ item.method }} {{ item.url }} {{ item.handler }} 
        </div>
    </div>
    <div v-else>
        {{ error }}
    </div>
</template>