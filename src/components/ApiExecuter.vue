<script setup lang="ts">
import { execute as executeApi } from '@api/api'
import { parse, compile } from 'path-to-regexp'

const Message = useMessage()
let props = withDefaults(defineProps<{
  api: APIModel,   // 接口信息
  closable: boolean // 是否可关闭 一般用于model中时 才可关闭
}>(), {
  closable: false // 默认不可关闭 
})

// 接口的请求体
let body = ref('')

const handleBodyChange = () => {
  console.log(body)
}

// 原始路径
let url = props.api.url

// 真实请求路径
let realURL = ref(url) // 真实的URL 开始赋为默认值

// 根据URL生成编译方法 用户后续编译成真正的URL 例如：模糊URL(/user/:id)这种
let compileFunnction = compile(url);

// 获取URL所有的模糊路径
let tokens = ref(parse(url).filter((token: any) => {
  return typeof token != 'string'
}).map((token: any) => {
  return {
    key: token.name,
    value: ''
  }
}))

// Token value发生变化时 实时计算真实的URL
const handleTokenValueInput = () => {
  let map: any = Object.create(null)
  tokens.value.forEach(token => {
    let key = token.key
    map[key] = token.value || (':' + token.key)
  })
  let path = compileFunnction(map)
  realURL.value = path
}


// URL中 ? 后面的东西
// let query = ref('')

/**
 * 是否有没填值的token
 */
const hasEmptyToken = () => {
  return tokens.value.findIndex((token) => token.value == '') >= 0
}


// API执行返回值
let executeResult = ref('')
let executeSuccess = ref(true)
const handleExecute = async () => {
  if (hasEmptyToken()) {
    return Message.warning('参数不能为空')
  }

  try {
    let result = await executeApi<any>({
      ...(props.api as APIModel),
      url: realURL.value
    }, {})
    if (typeof result == 'object') {
      result = JSON.stringify(result)
    }
    executeResult.value = result
    executeSuccess.value = true
    Message.success('执行成功！')
  } catch (err: any) {
    executeResult.value = err.message
    executeSuccess.value = false
    Message.error('执行失败！')
  }
}

// 对外发布的事件 当该组件用在model中时 card中会有一个关闭按钮
let emits = defineEmits(['close'])
const handleClose = () => {
  emits('close', true)
}

</script>

<template>
  <n-card style="width: 800px" title="接口测试" :bordered="false" size="huge" role="dialog" aria-modal="true" :closable="closable" @close="handleClose">

    <n-grid :cols="1" y-gap="10">
      <n-gi>
        <div class="item">
          {{ api.method }} : {{ realURL }}
        </div>
      </n-gi>

      <template v-if="api.method == 'POST'">
        <n-gi>
          <n-grid :cols="2" y-gap="4">
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
          </n-grid>
        </n-gi>
      </template>

      <template v-if="tokens.length > 0">
        <n-gi>
          <n-grid :cols="2">
            <n-gi>
              请求参数
            </n-gi>
            <n-gi>
              <div v-for="token in tokens" :key="token.key">
                {{ token.key }}
                <n-input v-model:value="token.value" :placeholder="'请输入' + token.key" :on-input="handleTokenValueInput"></n-input>
              </div>
            </n-gi>
          </n-grid>
        </n-gi>
      </template>

      <n-gi>
        <div :class="{'execute-failed': !executeSuccess}">
          {{ executeResult }}
        </div>
      </n-gi>

    </n-grid>
    <template #footer>
      <n-button @click="handleExecute">立即运行</n-button>
    </template>
  </n-card>
</template>

<style scoped>
.item {
  height: 100%;
}

.execute-failed {
  color: red;
}
</style>