export interface Message {
  text: string
  type: 'sent' | 'received'
  model?: string
  avatar?: string
}
