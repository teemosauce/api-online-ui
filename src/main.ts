import '@styles/index.scss'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

console.log(import.meta.env)

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
