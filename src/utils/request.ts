import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'

// 后台接口返回的基本结构
export interface ResponseResult<T> {
    success: boolean,
    data?: T,
    code?: number,
    message?: string
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        key?: string, // 请求的key
        repeat?: boolean // 是否可重复请求
    }

    // 这里好像是不能重写data的类型，只能在重新定义一个属性
    export interface AxiosResponse {
        data1: ResponseResult<any>,
    }
}

// let BASE_API = import.meta.env.VITE_BASE_API;

let BASE_API = "/api-online"

const instance: AxiosInstance = axios.create({
    baseURL: BASE_API,
    timeout: 1000 * 60, // 一分钟超时
    responseType: 'json'
})

/**
 * 根据请求信息生成唯一的key
 * 
 * @param config 请求的config
 * @returns 计算的key
 */
function getKeyOfRequest(config: AxiosRequestConfig): string {
    return `${config.method}:${config.url}:${qs.stringify(config?.data)}`
}

// 保存正在进行的所有请求
const requesting = new Map<string, AbortController>()

function watchRequest(config: AxiosRequestConfig) {
    const controller = new AbortController()
    config.signal = controller.signal
    const key = getKeyOfRequest(config)
    config.key = key
    if (requesting.has(key)) {
        removeRequest(key)
    }

    addRequest(key, controller)
}

function addRequest(key: string, controller: AbortController) {
    requesting.set(key, controller) // signal不同 所以要重新加上
}

function removeRequest(key: string) {
    if (requesting.has(key)) {
        let controller = requesting.get(key)
        if (controller) {
            controller.abort()
        }
        requesting.delete(key)
    }
}

instance.interceptors.request.use((config: any) => {
    if (!config.repeat) {
        watchRequest(config)
    }
    return config
}, (error: AxiosError) => {
    return Promise.reject(error)
})

instance.interceptors.response.use((response: AxiosResponse) => {
    response.data1 = response.data;
    const { config, data1: data, statusText } = response


    // response

    const key = config.key
    if (key) {
        removeRequest(key)
    }

    if (response.status === 200) {
        if (data.success) {
            return data.data
        } else {
            return Promise.reject(new Error(data.message))
        }
    }
    return Promise.reject(new Error(statusText))
}, (error: AxiosError) => {
    return Promise.reject(error)
})
export default instance