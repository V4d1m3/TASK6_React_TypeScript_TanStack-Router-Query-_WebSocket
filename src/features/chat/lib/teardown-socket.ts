export function teardownSocket(socket: WebSocket | null): void {
  if (!socket) return

  socket.onopen = null
  socket.onmessage = null
  socket.onerror = null
  socket.onclose = null

  if (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  ) {
    socket.close()
  }
}
