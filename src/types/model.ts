export interface AIModel {
  value: string
  label: string
  disabled?: boolean
}

export type ModelType = 'glm-4' | 'gpt-4' | 'gpt-3.5-turbo'
