<script setup lang="ts">
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from '~/utils/request'

const router = useRouter()
const request = useRequest()
const verificationCode = ref('')
const isLoading = ref(false)

interface LoginResponse {
  code: string
  info: string
  data: string
}

async function handleLogin() {
  if (!verificationCode.value) {
    message.error('请输入验证码')
    return
  }

  isLoading.value = true
  try {
    const response = await request.post<LoginResponse>('/v1/auth/wx_captcha_login', new URLSearchParams({
      code: verificationCode.value,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (response.data.code === '0000') {
      localStorage.setItem('token', response.data.data)
      message.success('登录成功')
      router.push('/')
    }
    else {
      message.error(response.data.info || '登录失败')
    }
  }
  catch (error: any) {
    message.error(error.response?.data?.info || '登录失败，请重试')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f5f4f1] px-4">
    <div class="max-w-sm w-full">
      <div class="overflow-hidden rounded-lg bg-[#fffefb] shadow-lg">
        <!-- 顶部标题栏 -->
        <div class="bg-[#3b3c3d] p-4 text-[#d4eaf7]">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-medium">
              验证码登录
            </h2>
            <a-button
              type="link"
              class="h-auto flex items-center p-0 text-[#d4eaf7] hover:text-[#71c4ef]"
              @click="router.push('/guide')"
            >
              <LeftOutlined class="text-xs" />
              <span class="ml-1 text-xs">返回</span>
            </a-button>
          </div>
        </div>

        <!-- 登录表单 -->
        <div class="p-4 space-y-4">
          <div class="space-y-2">
            <label class="block text-xs text-[#313d44] font-medium">验证码</label>
            <a-input
              v-model:value="verificationCode"
              placeholder="请输入验证码"
              size="middle"
              class="focus:border-[#71c4ef] hover:border-[#71c4ef]"
              @keyup.enter="handleLogin"
            />
            <p class="mt-1 text-xs text-[#313d44]">
              请输入从公众号获取的验证码
            </p>
          </div>

          <a-button
            type="primary"
            size="middle"
            block
            :loading="isLoading"
            class="h-10 bg-[#3b3c3d] transition-colors hover:bg-[#71c4ef]"
            @click="handleLogin"
          >
            <template #icon>
              <LoginOutlined class="text-xs" />
            </template>
            <span class="text-xs">登录</span>
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-input) {
  font-size: 12px !important;
}

:deep(.ant-input::placeholder) {
  font-size: 12px !important;
}

:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #71c4ef !important;
  box-shadow: 0 0 0 2px rgba(113, 196, 239, 0.2) !important;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #71c4ef !important;
}

:deep(.ant-input:hover) {
  border-color: #71c4ef !important;
}

:deep(.ant-input:focus) {
  border-color: #71c4ef !important;
  box-shadow: 0 0 0 2px rgba(113, 196, 239, 0.2) !important;
}
</style>
