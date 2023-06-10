import request from '@utils/request'


// 后续把所有的类型提到一个types的文件夹中

/**
 * 查询指定空间下的全部API
 * @param workspace 工作空间
 * @returns API列表
 */
export function list(workspace: string): Promise<Array<APIModel>> {
    return request.get(`/${workspace}/apis/list`)
}


/**
 * 在指定空间下新增API
 * @param workspace 工作空间
 * @param data API数据
 * @returns 新增的API数据
 */
export function create(api: APIModel): Promise<APIModel> {
    return request.post(`/${api.workspace}/apis/create`, api)
}

export function update(api: APIModel): Promise<APIModel> {
    return request.put(`/${api.workspace}/apis/${api.id}`, api)
}

export function remove(api: APIModel): Promise<any> {
    return request.delete(`${api.workspace}/apis/${api.id}`)
}


// http://localhost:8999/myspace/xyoFHPWSLqboVSw_Quyzi/test/api
export function execute<T>(api: APIModel, body: object): Promise<T> {
    // 这里还应该有路径动态参数 query参数 以及body信息
    return request({
        method: api.method,
        url: `/workspace/${api.workspace}${api.url}`,
        data: body,
    })
}

export default {
    list,
    create,
    execute
}