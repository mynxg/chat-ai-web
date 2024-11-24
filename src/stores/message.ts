import type { Message } from './types'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[],
    isGenerating: false,
  }),

  actions: {
    addMessage(message: Message) {
      this.messages.push(message)
    },

    clearMessages() {
      this.messages = []
    },

    setGenerating(status: boolean) {
      this.isGenerating = status
    },

    async generateResponse(userMessage: string, model: string) {
      this.setGenerating(true)
      try {
        const response = await fetch('http://localhost:8081/api/v1/chatglm/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || '',
          },
          body: JSON.stringify({
            messages: [
              {
                content: userMessage,
                role: 'user',
              },
            ],
            model,
          }),
        })

        if (!response.ok)
          throw new Error('Network response was not ok')

        const reader = response.body?.getReader()
        if (!reader)
          throw new Error('No reader available')

        let accumulatedMessage = ''

        // 创建一个新的消息对象用于累积内容
        this.addMessage({
          text: '',
          type: 'received',
          model,
          avatar: 'https://via.placeholder.com/32',
        })

        while (true) {
          const { done, value } = await reader.read()
          if (done)
            break

          // 解码收到的数据
          const text = new TextDecoder().decode(value)
          accumulatedMessage += text

          // 更新最后一条消息的内容
          this.messages[this.messages.length - 1].text = accumulatedMessage
        }
      }
      catch (error) {
        console.error('Error:', error)
        this.addMessage({
          text: '抱歉，发生了错误，请重试',
          type: 'received',
          model,
          avatar: 'https://via.placeholder.com/32',
        })
      }
      finally {
        this.setGenerating(false)
      }
    },
  },
})
