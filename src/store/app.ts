import { defineStore } from "pinia"


const STORE_KEY = 'APIONLINE-APP' 
let storagedAppString: string | null = localStorage.getItem(STORE_KEY)

let workspaces: Array<WorkspaceModel> = new Array();
let defaultWorkspace: WorkspaceModel;
if (storagedAppString) {
    try {
        let storagedApp: any = JSON.parse(storagedAppString)
        workspaces = storagedApp.workspaces as Array<WorkspaceModel>;
        defaultWorkspace = storagedApp.defaultWorkspace as WorkspaceModel
        let index = 0
        if (defaultWorkspace) {
            index = workspaces.findIndex(item => item.name == defaultWorkspace.name)
            if (index < 0) {
                index = 0
            }
        }
        defaultWorkspace = workspaces[index]
    } catch (error) {
        workspaces = []
    }
}
export const useAppStore = defineStore('app', {
    state() {
        return {
            defaultWorkspace: defaultWorkspace,
            workspaces: workspaces,
        }
    },
    getters: {
        workspace(store) {
            return store.defaultWorkspace
        }
    },
    actions: {
        /**
         * 
         * @param workspace 添加workspace
         */
        addWorkspaces(workspace: WorkspaceModel) {
            this.workspaces.push(workspace)

            // 如果是第一个 则设为当前的workspace
            if (!this.workspace) {
                this.setWorkspace(workspace)
            }
        },
        /**
         * 设置workspace
         * @param workspace 
         */
        setWorkspace(workspace: WorkspaceModel) {
            this.defaultWorkspace = workspace
        }
    },
    persist: {
        key: STORE_KEY,
        paths: ['workspaces', 'defaultWorkspace']
    }
})