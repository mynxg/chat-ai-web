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
        await new Promise(resolve => setTimeout(resolve, 1000))

        this.addMessage({
          text: `模拟AI回复: ${userMessage}`,
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
