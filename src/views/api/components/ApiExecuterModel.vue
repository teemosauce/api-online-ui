<script setup lang="ts">

// 定义组件接收的属性信息
let props = defineProps<{
    api: APIModel
}>()

// 定义组件接收的事件信息
const emits = defineEmits(['close'])
let showModal = ref(false)
watchEffect(() => {
    showModal.value = (props.api?.workspace !== '')
})

/**
 * 关闭对话框事件
 */
const closeModal = () => {
    console.log("Close Modal!")
    showModal.value = false
    emits('close')
}
</script>

<template>
    <n-modal v-model:show="showModal" @on-after-leave="closeModal" @on-mask-click="closeModal" @on-esc="closeModal" :mask-closable="true" transform-origin="center">
        <api-executer :api="api" :closable="true" @close="closeModal">
        </api-executer>
    </n-modal>
</template>