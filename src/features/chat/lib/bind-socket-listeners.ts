export type SocketListenerHandlers = {
  onOpen: () => void
  onMessage: (text: string) => void
  onClose: () => void
  onError: () => void
}

export function bindSocketListeners(
  socket: WebSocket,
  handlers: SocketListenerHandlers,
): void {
  socket.addEventListener('open', handlers.onOpen)
  socket.addEventListener('message', (event) => {
    const text =
      typeof event.data === 'string' ? event.data : '[binary payload]'
    handlers.onMessage(text)
  })
  socket.addEventListener('close', handlers.onClose)
  socket.addEventListener('error', handlers.onError)
}
