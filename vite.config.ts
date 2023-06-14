import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

/**
 * 拼接路径
 * @param dir 后续路径
 * @returns 完整路径
 */
function pathResolve(dir: string): string {
  return resolve(__dirname, './', dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const ENV = loadEnv(mode, process.cwd())
  const VITE_APP_TITLE = ENV['VITE_APP_TITLE']
  const VITE_BASE_URL = ENV['VITE_BASE_URL']
  const VITE_BASE_API_PROXY = ENV['VITE_BASE_API_PROXY']
  const REPLACE_BASE_URL_REG = new RegExp(`^\\${VITE_BASE_URL}`)
  console.log({
    mode,
    VITE_APP_TITLE,
    VITE_BASE_URL,
    VITE_BASE_API_PROXY
  })

  return {
    // base: mode == 'production' ? '/api-online' : '/', // 静态资源的引用路径 
    base: '/',
    resolve: {

      // 配置完alias, 要想编辑器还能自动提示路径，需要配置tsconfig.json中的compilerOptions
      alias: {
        '@': pathResolve('src'), // src快捷目录
        '@assets': pathResolve('src/assets'), // 资源快捷目录
        '@components': pathResolve('src/components'), // 组件快捷目录
        '@views': pathResolve('src/views'), // 页面快捷目录
        '@api': pathResolve('src/api'), // 接口快捷目录
        '@utils': pathResolve('src/utils'), // 工具快捷目录
        '@styles': pathResolve('src/styles'), // 样式快捷目录
        '@store': pathResolve('src/store'), // 数据快捷目录
      }
    },
    plugins: [
      // 组件自动引入插件 不需要再手动引入第三方组件库


      // vue支持
      vue({

      }),
      // 自动引入vue和naive-ui的相关方法
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      // 自动引入naive-ui组件
      Components({
        dirs: ['src/components'], // 这些目录里面的组件支持自动引入
        resolvers: [NaiveUiResolver()]

      }),
      // 给HTML页面注入数据
      createHtmlPlugin(
        {
          inject: {
            data: {
              title: VITE_APP_TITLE
            }
          }
        }
      )
    ],

    server: {
      host: '0.0.0.0', // 内网其它机器可访问
      proxy: { // 代理设置
        [VITE_BASE_URL]: {
          target: VITE_BASE_API_PROXY,
          changeOrigin: true,
          rewrite: (path) => {
            console.log(VITE_BASE_URL, VITE_BASE_API_PROXY, path)
            // 拼不拼 VITE_BASE_URL
            // return path.replace(REPLACE_BASE_URL_REG, '')
            return path
          },
        }
      }
    }
  }
})
