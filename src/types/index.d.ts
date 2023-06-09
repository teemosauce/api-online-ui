// 后台接口返回的基本结构
interface ResponseResult<T> {
    readonly success: boolean,
    readonly data?: T,
    readonly code?: number,
    readonly message?: string
}

interface APIModel {
    url?: string,
    code?: string,
    method?: string
}

interface WorkspaceModel {
    name: string,
}