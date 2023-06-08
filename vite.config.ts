import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'

const getEnvValue = (mode: string, key: string) => {
  return loadEnv(mode, process.cwd())[key];
}

/**
 * 拼接路径
 * @param dir 后续路径
 * @returns 完整路径
 */
function pathResolve(dir: string): string {
  return resolve(__dirname, './', dir)
}

const target = getEnvValue('development', 'BASE_URL')
console.log(target)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {

    // 配置完alias, 要想编辑器还能自动提示路径，需要配置tsconfig.json中的compilerOptions
    alias: {
      '@': pathResolve('src'), // src快捷目录
      '@assets': pathResolve('src/assets'), // 资源快捷目录
      '@components': pathResolve('src/components'), // 组件快捷目录
      '@router': pathResolve('src/router'), // 路由快捷目录
      '@store': pathResolve('src/store'), //数据状态快捷目录
      '@views': pathResolve('src/views'), // 页面快捷目录
      '@api': pathResolve('src/api'), // 接口快捷目录
      '@utils': pathResolve('src/utils'), // 工具快捷目录
    }
  },
  plugins: [
    // 组件自动引入插件 不需要再手动引入第三方组件库


    // vue支持
    vue({

    }),
    // 给HTML页面注入数据
    createHtmlPlugin(
      {
        inject: {
          data: {
            title: 'API Online'
          }
        }
      }
    )
  ],

  server: {
    proxy: {
      '/api-online': {
        target: 'http://localhost:8999/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-online/, ''),
        configure(proxy, options) {
          console.log(proxy, options)
        },
      }
    }
  }
})
