<script setup lang="ts">

import * as monaco from 'monaco-editor'
import './worker'

export interface Props {
    mode?: string;
    value?: string;
    readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'javascript',
    value: '',
    readonly: false,
})

// 实现双向数据绑定的基础 
const emits = defineEmits<(e: "update:value", value: string) => void>();

let elRef = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null;
onMounted(() => {
    editor = monaco.editor.create(elRef.value as HTMLElement, {
        value: props.value,
        language: props.mode,
        theme: 'vs-dark',
        readOnly: props.readonly,

        fontSize: 14,
        formatOnPaste: true,
        scrollBeyondLastLine: false,
        codeLens: true,
        wordWrap: 'bounded',
        showFoldingControls: 'mouseover',
        // cursorStyle: 'line',
        minimap: {
            enabled: false,
        },
    })

    editor.onDidChangeModelContent(() => {
        const value = editor?.getValue() || ''
        emits('update:value', value)
    })

    watchEffect(() => {
        const value = editor?.getValue()
        if (props.value !== value) {
            editor?.setValue(props.value)
        }
    })
})

onBeforeUnmount(() => {
    editor?.dispose()
})

</script>

<template>
    <div class="code-editor" ref="elRef"></div>
</template>

<style scoped lang="scss">
.code-editor {
    height: 480px;
    width: 100%;
    margin-top: 50px;
}
</style>