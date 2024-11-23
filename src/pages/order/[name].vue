<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const orderName = computed(() => route.params.name)
</script>

<template>
  <div class="h-full rounded-lg bg-white p-4">
    <h2 class="mb-4 text-xl font-bold">
      下单页面
    </h2>
    <div class="text-left">
      订单名称: {{ orderName }}
    </div>
    <!-- 这里添加下单表单等内容 -->
  </div>
</template>

<style scoped></style>
