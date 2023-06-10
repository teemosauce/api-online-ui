

<script setup lang="ts">
import { list as listApi, remove as removeApi } from '@api/api'
import { useAppStore } from '@store/app'
import { DataTableColumns, NButton, NIcon, NPopconfirm, PaginationProps } from 'naive-ui';
import { CaretForwardOutline, CodeSlashOutline, TrashOutline } from '@vicons/ionicons5'
import ApiExecuterModel from './components/ApiExecuterModel.vue';
import { useRouter } from 'vue-router';


const router = useRouter()
const appStore = useAppStore()

// 数据
const data = reactive({
    apiList: <Array<APIModel>>[],
    api: <APIModel>{},
});

// 表格头
const columns: DataTableColumns<APIModel> = [{
    title: '请求地址',
    key: 'url'
}, {
    title: '请求方式',
    key: 'method'
}, {
    title: '代码实现',
    key: 'code'
}, {
    title: '操作',
    key: 'action',
    render(row) {

        let executeButton = h(NButton, {
            type: 'default',
            size: 'small',
            iconPlacement: 'right',
            renderIcon() {
                return h(NIcon, null, {
                    default: () => h(CaretForwardOutline)
                })
            },
            onClick: () => {
                data.api = row
                executerModalShow.value = true
            }
        }, {
            default() {
                return '运行'
            }
        })

        let editButton = h(NButton, {
            type: 'default',
            size: 'small',
            iconPlacement: 'right',
            renderIcon() {
                return h(NIcon, null, {
                    default: () => h(CodeSlashOutline)
                })
            },
            onClick: () => {
                router.push({
                    path: '/api/create',
                    query: {
                        ...row
                    }
                })
            }
        }, {
            default() {
                return '编辑'
            }
        })

        let deleteButton = h(NPopconfirm, {
            async onPositiveClick() {
                try {
                    await removeApi(row)
                    Message.success("删除成功")
                } catch (error) {
                    Message.success("删除失败")
                }
                queryApiList()
            },
            negativeText: '取消',
            positiveText: '确认',
            showIcon: true,
        }, {
            // trigger 插槽
            trigger: () => {
                return h(NButton, {
                    type: 'error',
                    size: 'small',
                    iconPlacement: 'right',
                    renderIcon() {
                        return h(NIcon, null, {
                            default: () => h(TrashOutline)
                        })
                    }
                }, {
                    default: () => {
                        return '删除'
                    }
                })
            },
            default: () => {
                return '确认要删除该条记录吗？'
            }
        })
        return h('div', {
        }, [executeButton, editButton, deleteButton])
    }
}]

// 分页信息
const pagination: PaginationProps = {
    pageSize: 10
}

const Message = useMessage()

// 获取接口列表数据
async function queryApiList() {
    try {
        data.apiList = await listApi(appStore.workspace.name)
    } catch (err: any) {
        data.apiList = []
        Message.error(err.message)
    }
}
onMounted(() => {
    queryApiList()
})

// 弹出测试接口界面
const executerModalShow = ref(false)

// 
function handleExecuterModalClose() {
    executerModalShow.value = false
    data.api = {
        workspace: '',
        method: '',
        url: '',
        code: ''
    }
}

</script>

<template>
    API列表
    <n-data-table :columns="columns" :data="data.apiList" :pagination="pagination" :bordered="false">
    </n-data-table>
    <api-executer-model :show="executerModalShow" :api="data.api" @close="handleExecuterModalClose">
    </api-executer-model>
</template>