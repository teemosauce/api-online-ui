import { RouteRecordRaw, Router, createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@views/dashboard/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Dashboard,
    }, {
        path: '/dashboard',
        redirect: '/'
    }
]


const router: Router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router