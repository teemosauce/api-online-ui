import { RouteRecordRaw, Router, createRouter, createWebHashHistory } from 'vue-router'
import Welcome from '@views/welcome/index.vue'
import Layout from '@/layout/index.vue'
import { App } from 'vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {
            path: '/welcome'
        },
    }, {
        path: '/welcome',
        component: Welcome
    }, {
        path: '/dashboard',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('@views/dashboard/index.vue')
            }
        ]
    }, {
        path: '/api',
        component: Layout,
        children: [
            {
                path: 'list',
                component: () => import('@views/api/list.vue')
            },
            {
                path: 'create',
                component: () => import('@views/api/create.vue')
            }
        ]
    }
]


const router: Router = createRouter({
    routes,
    history: createWebHashHistory()
})

/**
 * 注册路由
 * @param app 应用实例 
 */
export default router
