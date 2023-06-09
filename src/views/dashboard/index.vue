<script setup lang="ts">
import { create as createWorkspace } from '@api/workspace'
import { useAppStore } from '@store/app'
const appStore = useAppStore()

// 当前的命名空间
onBeforeMount(async () => {
    if (!appStore.workspace) {
        try {
            const workspace: WorkspaceModel = await createWorkspace()
            appStore.addWorkspaces(workspace)
        } catch (error) {
        }
    }
})

</script>

<template>
    <h2>{{ appStore.workspace?.name }}</h2>
</template>