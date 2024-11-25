<script setup lang="ts">
import {
  GiftOutlined,
  LogoutOutlined,
  MessageOutlined,
  RobotOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPage = inject('currentPage', ref('chat'))

function switchTab(tab: string) {
  currentPage.value = tab
}

function handleLogout() {
  localStorage.removeItem('token')
  message.success('已退出登录')
  router.push('/guide')
}
</script>

<template>
  <nav class="nav-container">
    <ul class="h-11 flex items-center justify-between px-4 md:px-8">
      <li>
        <a-tooltip
          placement="bottom"
          :mouse-enter-delay="0.3"
          overlay-class-name="custom-tooltip"
        >
          <template #title>
            <span class="tooltip-text">聊天</span>
          </template>
          <a
            class="nav-item"
            :class="{ 'nav-item-active': currentPage === 'chat' }"
            @click="switchTab('chat')"
          >
            <MessageOutlined class="text-xl" />
          </a>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
          placement="bottom"
          :mouse-enter-delay="0.3"
          overlay-class-name="custom-tooltip"
        >
          <template #title>
            <span class="tooltip-text">bot助手</span>
          </template>
          <a
            class="nav-item"
            :class="{ 'nav-item-active': currentPage === 'bot' }"
            @click="switchTab('bot')"
          >
            <RobotOutlined class="text-xl" />
          </a>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
          placement="bottom"
          :mouse-enter-delay="0.3"
          overlay-class-name="custom-tooltip"
        >
          <template #title>
            <span class="tooltip-text">下单</span>
          </template>
          <a
            class="nav-item"
            :class="{ 'nav-item-active': currentPage === 'order' }"
            @click="switchTab('order')"
          >
            <ShoppingOutlined class="text-xl" />
          </a>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
          placement="bottom"
          :mouse-enter-delay="0.3"
          overlay-class-name="custom-tooltip"
        >
          <template #title>
            <span class="tooltip-text">抽奖</span>
          </template>
          <a
            class="nav-item"
            :class="{ 'nav-item-active': currentPage === 'gift' }"
            @click="switchTab('gift')"
          >
            <GiftOutlined class="text-xl" />
          </a>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown
          :trigger="['hover']"
          placement="bottom"
          overlay-class-name="user-dropdown"
        >
          <a
            class="nav-item"
            :class="{ 'nav-item-active': currentPage === 'user' }"
            @click="switchTab('user')"
          >
            <UserOutlined class="text-xl" />
          </a>
          <template #overlay>
            <a-menu @click="handleLogout">
              <a-menu-item key="logout" class="text-red-500">
                <template #icon>
                  <LogoutOutlined />
                </template>
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
:root {
  --primary-100: #d4eaf7;
  --primary-200: #b6ccd8;
  --primary-300: #3b3c3d;
  --accent-100: #71c4ef;
  --accent-200: #00668c;
  --text-100: #1d1c1c;
  --text-200: #313d44;
  --bg-100: #fffefb;
  --bg-200: #f5f4f1;
  --bg-300: #cccbc8;
}

.nav-container {
  @apply h-14 text-white relative;
  background-color: var(--primary-300);
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.nav-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--primary-300);
  backdrop-filter: blur(10px);
  border-radius: 0 0 1rem 1rem;
  z-index: -1;
}

.nav-container::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: -2;
}

.nav-item {
  @apply cursor-pointer relative flex items-center justify-center;
  height: 2.5rem;
  width: 2.5rem;
  transition: all 0.3s ease;
  color: var(--primary-100);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent-100);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-item:hover::after,
.nav-item-active::after {
  transform: scaleX(1);
}

.nav-item:hover {
  color: var(--accent-200);
}

.nav-item:hover .anticon {
  transform: scale(1.1);
}

.nav-item .anticon {
  transition: transform 0.3s ease;
  font-size: 1.25rem;
  @screen md {
    font-size: 1.5rem;
  }
}

.nav-item-active {
  color: var(--accent-200);
  background-color: rgba(0, 102, 140, 0.25);
  border-radius: 0.5rem;
  font-weight: 500;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 102, 140, 0.2);
}

.nav-item-active .anticon {
  transform: scale(1.1);
  filter: drop-shadow(0 1px 2px rgba(0, 102, 140, 0.3));
}

.nav-item-active::after {
  background-color: var(--accent-200);
  height: 3px;
  box-shadow: 0 1px 3px rgba(0, 102, 140, 0.2);
}

nav {
  width: 100%;
  position: relative;
}

:deep(.ant-tooltip) {
  --at-apply: text-sm;
}

:deep(.custom-tooltip) {
  @apply px-3 py-1.5;
  background-color: rgba(59, 60, 61, 0.95) !important;
  backdrop-filter: blur(8px);
  border-radius: 6px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform-origin: top;
  animation: tooltipSlideIn 0.2s ease-out;
}

:deep(.custom-tooltip .ant-tooltip-arrow) {
  display: none;
}

:deep(.tooltip-text) {
  @apply text-sm font-medium;
  color: var(--bg-100);
  letter-spacing: 0.5px;
}

@keyframes tooltipSlideIn {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

:deep(.user-dropdown) {
  min-width: 120px;
  background-color: var(--bg-100);
  border-radius: 8px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

:deep(.user-dropdown .ant-dropdown-menu) {
  padding: 4px;
  background-color: transparent;
  border-radius: 8px;
}

:deep(.user-dropdown .ant-dropdown-menu-item) {
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.user-dropdown .ant-dropdown-menu-item:hover) {
  background-color: rgba(255, 77, 79, 0.1);
}

:deep(.user-dropdown .ant-dropdown-menu-item .anticon) {
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .nav-item {
    height: 2rem;
    width: 2rem;
  }

  .nav-item .anticon {
    font-size: 1.125rem !important;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .nav-item {
    height: 2.25rem;
    width: 2.25rem;
  }

  .nav-item .anticon {
    font-size: 1.25rem !important;
  }
}
</style>
