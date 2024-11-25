<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRequest } from '~/utils/request'

interface UserQuota {
  totalQuota: number
  usedQuota: number
  remainQuota: number
}

interface QuotaResponse {
  code: string
  info: string
  data: UserQuota
}

const request = useRequest()
const loading = ref(false)
const userQuota = ref<UserQuota>({
  totalQuota: 0,
  usedQuota: 0,
  remainQuota: 0,
})

// 获取用户额度信息
async function fetchUserQuota() {
  loading.value = true
  try {
    const response = await request.get<QuotaResponse>('/v1/user/query_quota')
    if (response.data.code === '0000') {
      userQuota.value = response.data.data
    }
    else {
      message.error(response.data.info || '获取额度信息失败')
    }
  }
  catch (error: any) {
    message.error(error.response?.data?.info || '获取额度信息失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserQuota()
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 用户信息卡片 -->
    <div class="shrink-0">
      <a-card :bordered="false" class="overflow-hidden">
        <div class="flex items-center gap-4">
          <div class="relative h-16 w-16 shrink-0">
            <div class="absolute inset-0 flex items-center justify-center rounded-full bg-[#f5f4f1]">
              <UserOutlined class="text-2xl text-[#00668c]" />
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-[#313d44] font-medium">用户账号</span>
            <span class="text-xs text-[#666]">普通会员</span>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 额度信息卡片 -->
    <div class="mt-4 flex-1">
      <a-card :bordered="false" title="额度信息">
        <a-spin :spinning="loading">
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col items-center justify-center rounded-lg bg-[#f5f4f1] p-4">
              <span class="text-xs text-[#666]">总额度</span>
              <span class="mt-1 text-lg text-[#313d44] font-medium">{{ userQuota.totalQuota }}</span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-lg bg-[#f5f4f1] p-4">
              <span class="text-xs text-[#666]">已使用</span>
              <span class="mt-1 text-lg text-[#313d44] font-medium">{{ userQuota.usedQuota }}</span>
            </div>
            <div class="flex flex-col items-center justify-center rounded-lg bg-[#f5f4f1] p-4">
              <span class="text-xs text-[#666]">剩余</span>
              <span class="mt-1 text-lg text-[#00668c] font-medium">{{ userQuota.remainQuota }}</span>
            </div>
          </div>

          <!-- 进度条 -->
          <div class="mt-4">
            <div class="mb-1 flex items-center justify-between text-xs">
              <span class="text-[#666]">使用进度</span>
              <span class="text-[#00668c]">{{ Math.round((userQuota.usedQuota / userQuota.totalQuota) * 100) }}%</span>
            </div>
            <a-progress
              :percent="(userQuota.usedQuota / userQuota.totalQuota) * 100"
              :show-info="false"
              :stroke-color="{
                '0%': '#71c4ef',
                '100%': '#00668c',
              }"
              :stroke-width="8"
              class="custom-progress"
            />
          </div>
        </a-spin>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-card-head) {
  min-height: auto;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-card-head-title) {
  font-size: 14px;
  color: #313d44;
  font-weight: 500;
}

:deep(.ant-card-body) {
  padding: 16px;
}

:deep(.custom-progress .ant-progress-bg) {
  transition: all 0.3s ease;
}
</style>
