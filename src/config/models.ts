import type { AIModel } from '~/types/model'

export const defaultModels: AIModel[] = [
  {
    value: 'glm-4',
    label: 'glm-4',
  },
  {
    value: 'gpt-4',
    label: 'GPT-4',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'gpt-3.5-turbo',
  },
]

export const defaultModel = 'glm-4'
