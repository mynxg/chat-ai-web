<script setup lang="ts">
import { ref } from 'vue'
import BotAssistant from '~/components/BotAssistant.vue'
import DialogBox from '~/components/DialogBox.vue'
import InputBox from '~/components/InputBox.vue'
import LuckyDraw from '~/components/LuckyDraw.vue'
import OrderPage from '~/components/OrderPage.vue'
import UserPage from '~/components/UserPage.vue'

defineOptions({
  name: 'IndexPage',
})

const showOrder = ref(false)
const currentPage = ref<'chat' | 'bot' | 'order' | 'gift' | 'user'>('chat')

function toggleView(page: 'chat' | 'bot' | 'order' | 'gift' | 'user') {
  currentPage.value = page
  showOrder.value = page === 'order'
}

provide('toggleView', toggleView)
provide('currentPage', currentPage)
</script>

<template>
  <div class="fixed inset-0 flex flex-col overflow-hidden">
    <!-- 顶部导航栏 -->
    <div class="flex flex-none justify-center">
      <div class="w-full px-4 lg:w-2/3 md:w-3/4 sm:w-4/5 xl:w-2/5">
        <TheSiderBar />
      </div>
    </div>

    <!-- 中间内容区域 -->
    <div class="min-h-0 flex flex-1 justify-center">
      <div class="h-full w-full px-4 lg:w-2/3 md:w-3/4 sm:w-4/5 xl:w-2/5">
        <Transition name="fade" mode="out-in">
          <component
            :is="currentPage === 'chat'
              ? DialogBox
              : currentPage === 'order'
                ? OrderPage
                : currentPage === 'bot'
                  ? BotAssistant
                  : currentPage === 'user'
                    ? UserPage
                    : LuckyDraw"
          />
        </Transition>
      </div>
    </div>

    <!-- 底部输入框 -->
    <div v-if="currentPage === 'chat'" class="flex flex-none justify-center">
      <div class="w-full px-4 lg:w-2/3 md:w-3/4 sm:w-4/5 xl:w-2/5">
        <InputBox />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
