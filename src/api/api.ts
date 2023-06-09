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
export function create(workspace: string, data: APIModel): Promise<APIModel> {
    return request.post(`/${workspace}/apis/create`, data)
}


// http://localhost:8999/myspace/xyoFHPWSLqboVSw_Quyzi/test/api
export function test<T>(workspace: string, data: APIModel, body: object): Promise<T> {
    // 这里还应该有路径动态参数 query参数 以及body信息
    return request({
        method: data.method,
        url: `/myspace/${workspace}${data.url}`,
        data: body,
    })
}

export default {
    list,
    create,
    test
}