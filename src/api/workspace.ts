import request from '@utils/request'

export function create(): Promise<WorkspaceModel> {
    return request.post("/workspace/create")
}