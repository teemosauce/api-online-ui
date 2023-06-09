import { createPinia } from 'pinia'
import persisted from 'pinia-plugin-persistedstate'

const store = createPinia()

store.use(persisted) // 数据持久化插件

export default store