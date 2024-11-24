<script setup lang="ts">
import type { Message } from './types'
import { CopyOutlined, DownOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useMessageStore } from '~/stores/message'
import MarkdownRenderer from './MarkdownRenderer.vue'

const messageStore = useMessageStore()
const messagesContainer = ref<HTMLElement | null>(null)
const showScrollBottom = ref(false)

// 判断是否正在加载回复
const isLoading = computed(() => messageStore.isGenerating)

function isLatestReceivedMessage(index: number) {
  const lastReceivedIndex = messageStore.messages
    .map((msg, idx) => ({ msg, idx }))
    .reverse()
    .find(({ msg }) => msg.type === 'received')
    ?.idx
  return index === lastReceivedIndex
}

function reloadMessage(_msg: Message) {
  message.success('重新请求中...')
}

function copyMessage(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('消息已复制')
  })
}

// 检查是否需要显示滚动到底部按钮
function checkScroll() {
  if (!messagesContainer.value)
    return
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  // 如果距离底部超过100px，显示滚动按钮
  showScrollBottom.value = scrollHeight - scrollTop - clientHeight > 100
}

// 滚动到底部的函数
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth',
      })
      showScrollBottom.value = false
    }
  })
}

// 监听消息变化
watch(
  () => messageStore.messages,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

// 监听滚动事件
onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', checkScroll)
  }
})
</script>

<template>
  <div class="relative h-full flex flex-col">
    <div
      ref="messagesContainer"
      class="scrollbar-hide flex-1 overflow-y-auto px-2"
      @scroll="checkScroll"
    >
      <div class="w-full py-4 space-y-4">
        <div
          v-for="(msg, index) in messageStore.messages"
          :key="index"
          class="message-item animate-fade-in"
          :class="[msg.type === 'sent' ? 'message-sent' : 'message-received']"
        >
          <div
            class="mb-1 px-2 text-xs text-[#313d44] opacity-75"
            :class="msg.type === 'sent' ? 'text-right' : 'text-left'"
          >
            {{ msg.type === 'sent' ? '我' : msg.model }}
          </div>

          <div class="relative">
            <div
              class="flex items-start gap-2"
              :class="msg.type === 'sent' ? 'justify-end' : 'justify-start'"
            >
              <img
                v-if="msg.type === 'received' && msg.avatar"
                :src="msg.avatar"
                alt="avatar"
                class="h-8 w-8 rounded-full"
              >
              <div
                class="px-3 py-2 text-left text-sm"
                :class="[
                  msg.type === 'sent'
                    ? 'bg-[#f5f4f1] rounded-lg shadow-sm inline-block'
                    : 'w-full',
                ]"
              >
                <div
                  class="break-words text-sm"
                  :class="msg.type === 'sent' ? 'text-[#1d1c1c]' : 'text-[#1d1c1c]'"
                >
                  <template v-if="msg.type === 'received'">
                    <MarkdownRenderer :content="msg.text" />
                  </template>
                  <template v-else>
                    {{ msg.text }}
                  </template>
                </div>
                <div
                  v-if="msg.type === 'received'"
                  class="absolute left-0 flex gap-1 opacity-0 transition-opacity duration-200 -bottom-8 group-hover:opacity-100"
                >
                  <a-tooltip v-if="isLatestReceivedMessage(index)" title="重试">
                    <a-button
                      size="small"
                      shape="circle"
                      class="h-6 w-6 border-none bg-white text-xs transition-all hover:scale-110 hover:bg-[#d4eaf7] hover:text-[#00668c]"
                      @click="reloadMessage(msg)"
                    >
                      <template #icon>
                        <ReloadOutlined />
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="复制">
                    <a-button
                      size="small"
                      shape="circle"
                      class="h-6 w-6 border-none bg-white text-xs transition-all hover:scale-110 hover:bg-[#d4eaf7] hover:text-[#00668c]"
                      @click="copyMessage(msg.text)"
                    >
                      <template #icon>
                        <CopyOutlined />
                      </template>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="message-item message-received animate-fade-in">
          <!-- <div class="mb-1 px-2 text-left text-xs text-[#313d44] opacity-75">
            Assistant
          </div> -->
          <div class="relative">
            <div class="flex items-start justify-start gap-2">
              <div class="max-w-[80%] p-3">
                <div class="flex gap-1">
                  <div class="h-2 w-2 animate-bounce rounded-full bg-gray-300" style="animation-delay: 0s" />
                  <div class="h-2 w-2 animate-bounce rounded-full bg-gray-300" style="animation-delay: 0.2s" />
                  <div class="h-2 w-2 animate-bounce rounded-full bg-gray-300" style="animation-delay: 0.4s" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动到底部按钮 -->
    <Transition name="fade">
      <div
        v-if="showScrollBottom"
        class="absolute bottom-1 right-0 z-10"
      >
        <a-button
          type="primary"
          shape="circle"
          class="flex items-center justify-center bg-[#00668c] shadow-lg hover:bg-[#00668c]/80"
          @click="scrollToBottom"
        >
          <DownOutlined />
        </a-button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 隐藏滚动条但保持可滚动 */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* 其他样式保持不变 */
.message-item {
  @apply transition-all duration-300;
}

.message-sent {
  @apply flex flex-col items-end;
}

.message-received {
  @apply flex flex-col items-start w-full;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动按钮动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.message-bubble-sent {
  @apply bg-[#f5f4f1];
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-bubble-received {
  @apply bg-transparent;
}

:root {
  --message-font-size: 14px;
}

.message-sent,
.message-received {
  font-size: var(--message-font-size);
}
</style>
