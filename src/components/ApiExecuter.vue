<script setup lang="ts">
import api, { execute as executeApi } from '@api/api'
import { parse, Token, compile } from 'path-to-regexp'
// 定义组件接收的属性信息
interface ApiExecuterProps {
  api: APIModel,   // 接口信息
  closable: boolean // 是否可关闭 一般用于model中时 才可关闭
}

const Message = useMessage()
let props = withDefaults(defineProps<ApiExecuterProps>(), {
  closable: false // 默认不可关闭 
})

// 接口的请求体
let body = ref('')

const handleBodyChange = () => {
  console.log(body)
}


let data = reactive({
  tokens: <Array<{
    key: string,
    value: string
  }>>[]
})
// interface Token {
//   key: ''
// }
// URL动态的东西 例如/test/:id 中的id

let compileFunnction: any

let changeURL = ref('')

watchEffect(() => {
  compileFunnction = compile(props.api.url)

  data.tokens = parse(props.api.url).filter((token: Token) => {
    return typeof token != 'string'
  }).map((item: Token) => {
    console.log(item)
    return {
      key: item.name,
      value: ''
    }
  })
  changeURL.value = props.api.url
})

const handleTokensChange = () => {

  let map: any = Object.create(null)
  data.tokens.forEach(token => {
    let key = token.key
    map[key] = token.value || (':' + token.key)
  })
  let path = compileFunnction(map)
  changeURL.value = path
}


// URL中 ? 后面的东西
// let query = ref('')


// API执行返回值
let executeResult = ref('')
const testApi = async () => {
  try {
    let result = await executeApi<any>({
      ...props.api,
      url: changeURL.value
    }, {})
    if (typeof result == 'object') {
      result = JSON.stringify(result)
    }
    executeResult.value = result
  } catch (err: any) {
    Message.error(err.message)
  }
}

let emits = defineEmits(['close'])
const handleClose = () => {
  emits('close', true)
}



</script>

<template>
  <n-card style="width: 800px" title="接口测试" :bordered="false" size="huge" role="dialog" aria-modal="true" :closable="closable" @close="handleClose">
    <!-- <template #header-extra>
      <slot name="header-extra"></slot>
    </template> -->

    <n-grid :cols="2" y-gap="10">
      <n-gi>
        <div>
          {{ api.method }}
        </div>
      </n-gi>
      <n-gi>
        <div>
          {{ changeURL }}
        </div>
      </n-gi>
      <template v-if="api.method == 'POST'">
        <n-gi>
          <div>
            请求体
          </div>
        </n-gi>
        <n-gi>
          <div>
            <n-input v-model:value="body" placeholder="请输入请求体参数" type="textarea" @input="handleBodyChange"></n-input>
            <label>{{ body }}</label>
          </div>
        </n-gi>
      </template>

      <template v-if="data.tokens.length > 0">
        <n-gi>
          <div>
            请求参数
          </div>
        </n-gi>
        <n-gi>
          <div>
            <n-grid :cols="2">
              <template v-for="token in data.tokens" :key="token.key">
                <n-gi>
                  <div>
                    {{ token.key }}
                  </div>
                </n-gi>
                <n-gi>
                  <div>
                    <n-input v-model:value="token.value" :placeholder="'请输入' + token.key" @input="handleTokensChange"></n-input>
                  </div>
                </n-gi>
              </template>
            </n-grid>
          </div>
        </n-gi>
      </template>


      <!-- <n-gi>
        <div>
          源码
        </div>
      </n-gi>
      <n-gi>
        <div>
          {{ api?.code }}
        </div>
      </n-gi> -->

      <n-gi>
        <div>
          返回结果
        </div>
      </n-gi>
      <n-gi>
        <div>
          {{ executeResult }}
        </div>
      </n-gi>

    </n-grid>
    <template #footer>
      <n-button @click="testApi">立即运行</n-button>
    </template>
  </n-card>
</template>

<style scoped></style>