import request from '@utils/request'

export function create(){
    return request.post("/workspace/create")
}