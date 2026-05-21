export type ChatConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error'

export type ChatMessageDirection = 'sent' | 'received' | 'system'

export type ChatMessage = {
  id: string
  text: string
  direction: ChatMessageDirection
  at: number
}
