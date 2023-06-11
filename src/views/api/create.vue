<script setup lang="ts">
import { FormInst, SelectOption } from 'naive-ui'
import { create as createApi, update as updateApi } from '@api/api'
import { useAppStore } from '@/store/app'
import { useRoute } from 'vue-router'

const Message = useMessage()
const appStore = useAppStore()
const route = useRoute()

const formRef = ref<FormInst | null>(null)

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

let apiModel: APIModel = reactive({
    id: '',
    workspace: appStore.workspace.name,
    method: <Method>'GET',
    url: '/',
    code: 'ctx.body="Hello World";'
})

onBeforeMount(() => {
    let query = route.query
    if (query.id) {
        apiModel.id = query.id as string
        apiModel.code = query.code as string
        apiModel.method = query.method as string
        apiModel.url = query.url as string
    }
})

let methods: Array<Method> = ['GET', 'POST', 'PUT', 'DELETE']
const methodOptions: Array<SelectOption> = methods.map((method) => {
    return {
        label: method,
        value: method,
    }
})

const rules = {
    method: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入请求方式'
    },
    url: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入请求路径'
    },
    code: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入请求处理方法'
    }
}

const changeMethod = () => {
    console.log()
}
const handleSave = async () => {
    let valid = false
    try {
        await formRef.value?.validate()
        valid = true
    } catch {
    } finally {
        if (valid) {
            if (apiModel.id) {
                // 编辑
                try {
                    await updateApi(apiModel)
                    Message.success('API编辑成功！')
                } catch (error: any) {
                    Message.error(error.message)
                }
            } else {
                // 新建
                try {
                    await createApi(apiModel)
                    Message.success('API创建成功！')
                } catch (error: any) {
                    Message.error(error.message)
                }
            }
        }
    }

}
</script>

<template>
    <n-form ref="formRef" :model="apiModel" :rules="rules" label-placement="left" label-width="auto" require-mark-placement="right-hanging" size="medium">
        <n-form-item label="请求方式" path="method">
            <n-select v-model:value="apiModel.method" :options="methodOptions" @update-value="changeMethod">
            </n-select>
        </n-form-item>
        <n-form-item label="请求路径" path="url">
            <n-input v-model:value="apiModel.url" placeholder="请输入请求路径" />
        </n-form-item>

        <n-form-item label="实现方法" path="code">
            <code-editor v-model:value="apiModel.code" mode="javascript"></code-editor>
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="handleSave">保存</n-button>
        </div>
    </n-form>
</template>