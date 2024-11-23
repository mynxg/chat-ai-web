<script setup lang="ts">
import { SendOutlined } from '@ant-design/icons-vue'
import { Button, Input, Select } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { useMessageStore } from '~/stores/message'

const messageStore = useMessageStore()
const newMessage = ref<string>('')
const selectedModel = ref<string>('gpt-3.5')

// 计算是否应该禁用输入
const isInputDisabled = computed(() => messageStore.isGenerating)

async function sendMessage() {
  if (newMessage.value.trim()) {
    // 添加用户消息
    messageStore.addMessage({
      text: newMessage.value,
      type: 'sent',
      model: selectedModel.value,
    })

    // 清空输入框
    const userMessage = newMessage.value
    newMessage.value = ''

    // 生成AI回复
    await messageStore.generateResponse(userMessage, selectedModel.value)
  }
}

// 处理键盘事件
function handleKeydown(e: KeyboardEvent) {
  if (isInputDisabled.value) {
    e.preventDefault()
    return
  }

  // Shift + Enter 换行
  if (e.key === 'Enter' && e.shiftKey)
    return

  // 仅 Enter 发送消息
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const getPopupContainer = (trigger: HTMLElement) => trigger.parentNode as HTMLElement
</script>

<template>
  <div class="flex flex-col bg-[#fffefb] px-2 py-2 md:px-4">
    <!-- Model Selector -->
    <div class="h-8 flex items-center">
      <a-config-provider :theme="{ token: { colorPrimary: '#00668c', borderRadius: '10px' } }">
        <a-select
          v-model:value="selectedModel"
          placement="topLeft"
          :get-popup-container="getPopupContainer"
          class="custom-select rounded-3xl"
          style="width: 100px; background-color: #f5f4f1;"
          :disabled="isInputDisabled"
        >
          <a-select-option value="gpt-3.5">
            3.5
          </a-select-option>
          <a-select-option value="gpt-4">
            GPT-4
          </a-select-option>
        </a-select>
      </a-config-provider>
    </div>

    <!-- Input Area -->
    <div class="mt-2">
      <div
        class="border border-[#cccbc8] rounded-lg bg-[#fffefb] transition-all"
        :class="[
          isInputDisabled ? 'opacity-60' : 'focus-within:border-[#71c4ef] hover:border-[#71c4ef] focus-within:shadow-md',
        ]"
      >
        <div class="relative">
          <a-textarea
            v-model:value="newMessage"
            :placeholder="isInputDisabled ? '等待回复中...' : '输入消息... (Shift + Enter 换行)'"
            class="w-full resize-none border-none pr-12 text-base md:text-sm focus:shadow-none"
            :auto-size="{ minRows: 1, maxRows: 6 }"
            :disabled="isInputDisabled"
            @keydown="handleKeydown"
          />
          <div class="absolute bottom-2 right-2">
            <a-button
              type="primary"
              shape="circle"
              :disabled="!newMessage.trim() || isInputDisabled"
              class="h-8 w-8 flex items-center justify-center bg-[#00668c] transition-all"
              :class="{
                'opacity-50': !newMessage.trim() || isInputDisabled,
                'hover:opacity-80': newMessage.trim() && !isInputDisabled,
              }"
              @click="sendMessage"
            >
              <SendOutlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-input) {
  background-color: transparent !important;
  line-height: 1.5;
  padding: 0.75rem !important;
  min-height: 40px !important;
}

:deep(.ant-input-textarea-show-count::after) {
  display: none;
}

:deep(.ant-input:focus) {
  box-shadow: none !important;
}

:deep(.ant-input)::-webkit-scrollbar {
  width: 4px;
}

:deep(.ant-input)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.ant-input)::-webkit-scrollbar-thumb {
  background-color: #cccbc8;
  border-radius: 4px;
}

.custom-select {
  background-color: var(--bg-200);
}

.custom-select:hover {
  border-color: var(--accent-100);
}

.custom-select .ant-select-selector {
  background-color: var(--bg-200) !important;
}

.custom-select .ant-select-selector:hover,
.custom-select .ant-select-selector:focus,
.custom-select.ant-select-focused .ant-select-selector {
  border-color: var(--accent-100) !important;
}
</style>
