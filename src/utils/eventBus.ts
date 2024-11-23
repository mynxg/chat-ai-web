import mitt from 'mitt'

export interface Events {
  'send-message': { text: string, model: string }
  'quote-message': string
}

export const eventBus = mitt<Events>()
export const typedEventBus = eventBus
