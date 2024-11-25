<script setup lang="ts">
import { ShoppingCartOutlined } from '@ant-design/icons-vue'
import { Empty, message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRequest } from '~/utils/request'

interface Product {
  productId: number
  productName: string
  productDesc: string
  quota: number
  price: number
}

interface ProductResponse {
  code: string
  info: string
  data: Product[]
}

interface PayOrderResponse {
  code: string
  info: string
  data: string
}

const request = useRequest()
const products = ref<Product[]>([])
const loading = ref(false)

// 获取产品列表
async function fetchProducts() {
  loading.value = true
  try {
    const response = await request.get<ProductResponse>('/v1/sale/query_product_list')
    const responseData = response.data as ProductResponse
    if (responseData.code === '0000') {
      products.value = responseData.data
    }
  }
  catch (error) {
    console.error('Failed to fetch products:', error)
  }
  finally {
    loading.value = false
  }
}

// 创建支付订单
async function handleBuy(productId: number) {
  try {
    message.loading('正在创建订单...', 0)
    // const formData = new URLSearchParams()
    // formData.append('productId',)
    const response = await request.post<PayOrderResponse>('/v1/sale/create_pay_order', new URLSearchParams({
      productId: productId.toString(),
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    message.destroy()

    if (response.data.code === '0000') {
      // 创建一个临时div来放置支付表单
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = response.data.data
      document.body.appendChild(tempDiv)

      // 获取表单并提交
      const form = tempDiv.querySelector('form')
      if (form) {
        form.submit()
      }
      else {
        message.error('支付表单加载失败')
      }

      // 清理临时div
      setTimeout(() => {
        document.body.removeChild(tempDiv)
      }, 100)
    }
    else {
      message.error(response.data.info || '创建订单失败')
    }
  }
  catch (error: any) {
    message.destroy()
    message.error(error.response?.data?.info || '创建订单失败')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 商品列表区域 -->
    <div class="mt-1 flex-1 overflow-auto">
      <a-card :bordered="false">
        <template #title>
          <div class="flex items-center gap-3">
            <ShoppingCartOutlined class="ml-2 text-base text-[#00668c]" />
            <span class="text-sm text-[#313d44] font-medium">商品列表</span>
          </div>
        </template>

        <a-spin :spinning="loading">
          <template v-if="products && products.length > 0">
            <div class="grid gap-2 sm:grid-cols-3">
              <div
                v-for="product in products"
                :key="product.productId"
                class="group relative m-1 border border-[#e1e4e8] rounded-lg bg-white p-2 transition-all hover:border-[#71c4ef] hover:shadow-md"
              >
                <!-- 商品名称和价格 -->
                <div class="mb-1 flex items-start justify-center gap-1">
                  <h3 class="line-clamp-1 text-sm text-[#313d44] font-medium">
                    {{ product.productName }}
                  </h3>
                </div>
                <div class="mb-1 flex items-center justify-center gap-1">
                  <div class="flex flex-col">
                    <span class="text-sm text-[#313d44] font-medium">
                      {{ product.quota }} 次
                    </span>
                  </div>
                </div>
                <div class="mb-1 flex items-start justify-center gap-0">
                  <div class="flex flex-col items-end">
                    <span class="text-base text-[#00668c] font-medium">
                      ¥ {{ product.price }}
                    </span>
                  </div>
                </div>

                <!-- 底部信息 -->
                <div class="flex items-center justify-center">
                  <a-button
                    type="primary"
                    size="small"
                    class="flex items-center bg-[#00668c] text-sm transition-all hover:bg-[#71c4ef]"
                    @click="handleBuy(product.productId)"
                  >
                    <div class="flex items-center gap-0">
                      <ShoppingCartOutlined class="text-sm" />
                      <span>立即购买</span>
                    </div>
                  </a-button>
                </div>

                <!-- 悬浮效果装饰 -->
                <div
                  class="pointer-events-none absolute inset-0 border-2 border-[#71c4ef] rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </div>
          </template>

          <a-empty
            v-else
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
            description="暂无商品"
            class="py-8"
          />
        </a-spin>
      </a-card>
    </div>

    <!-- 测试账号信息固定在底部 -->
    <div class="mt-1 shrink-0 rounded-lg bg-[#f5f4f1] p-2">
      <h3 class="mb-0 text-sm text-[#313d44] font-semibold">
        支付宝沙箱：
      </h3>
      <div class="text-sm text-[#666] space-y-1">
        <p>测试账号：<span class="select-all text-[#00668c]">pmfbiu7873@sandbox.com</span></p>
        <p>支付密码：<span class="select-all text-[#00668c]">111111</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-card-head) {
  min-height: auto;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-card-body) {
  padding: 16px;
  overflow: visible;
}

:deep(.ant-card) {
  height: 100%;
}

/* 添加滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #cccbc8;
  border-radius: 4px;
}

:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

:deep(.ant-btn-primary) {
  box-shadow: none;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
  pointer-events: auto;
}

:deep(.ant-btn .anticon) {
  vertical-align: middle;
}

:deep(.ant-empty) {
  margin: 32px 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
