import request, { ResponseResult } from '@utils/request'

export interface APIModel {
    url?: string,
    handler?: string,
    method?: string
}


export function list(workspace: string): Promise<Array<APIModel>> {
    return request.get(`/${workspace}/apis/list`)
}