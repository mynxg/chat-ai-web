<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f5f4f1] px-4">
    <div class="max-w-xs w-full">
      <div class="rounded-lg bg-[#fffefb] p-3 shadow-md">
        <div class="flex flex-col items-center">
          <h2 class="mb-3 text-center text-sm text-[#313d44] font-bold">
            关注公众号获取验证码
          </h2>

          <!-- 二维码图片 -->
          <div class="mb-3 rounded-lg bg-[#f5f4f1] p-2 shadow-sm">
            <img
              src="/ew/qrcode.jpg"
              alt="公众号二维码"
              class="h-28 w-28 object-cover"
            >
          </div>

          <!-- 操作步骤 -->
          <div class="mb-3 w-full text-[#313d44]">
            <h3 class="mb-1.5 text-xs font-medium">
              操作步骤：
            </h3>
            <ol class="list-decimal list-inside text-xs space-y-1">
              <li>扫描上方二维码关注公众号</li>
              <li>发送消息"验证码"获取登录码</li>
              <li>复制验证码，点击下方按钮进入登录页面</li>
            </ol>
          </div>

          <!-- 已获取验证码按钮 -->
          <a-button
            type="primary"
            size="middle"
            class="h-8 w-full bg-[#3b3c3d] transition-colors hover:bg-[#71c4ef]"
            @click="goToLogin"
          >
            <span class="text-xs">已获取验证码，去登录</span>
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-decimal {
  list-style-type: decimal;
}
</style>
