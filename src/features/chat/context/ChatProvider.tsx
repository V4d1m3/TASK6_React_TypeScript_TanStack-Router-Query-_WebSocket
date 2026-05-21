import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { env } from '@/shared/config/env'
import { ChatContext, type ChatContextValue } from '@/features/chat/context/chat-context'
import { bindSocketListeners } from '@/features/chat/lib/bind-socket-listeners'
import { createMessageId } from '@/features/chat/lib/create-message-id'
import { teardownSocket } from '@/features/chat/lib/teardown-socket'
import type {
  ChatConnectionStatus,
  ChatMessage,
} from '@/features/chat/model/types'

type ChatProviderProps = {
  children: ReactNode
}

type OpenSocketOptions = {
  announceConnecting?: boolean
  announceConnected?: boolean
}

export function ChatProvider({ children }: ChatProviderProps) {
  const wsUrl = env.wsUrl
  const socketRef = useRef<WebSocket | null>(null)
  const generationRef = useRef(0)
  const isPageActiveRef = useRef(false)
  const manualDisconnectRef = useRef(false)
  const pendingMessageRef = useRef<string | null>(null)
  const reconnectTimerRef = useRef<number | null>(null)
  const openSocketRef = useRef<(options?: OpenSocketOptions) => void>(() => undefined)

  const [status, setStatus] = useState<ChatConnectionStatus>('idle')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isPageActive, setIsPageActive] = useState(false)

  const appendMessage = useCallback(
    (direction: ChatMessage['direction'], text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), text, direction, at: Date.now() },
      ])
    },
    [],
  )

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [])

  const flushPendingMessage = useCallback(
    (socket: WebSocket) => {
      const pending = pendingMessageRef.current
      if (!pending || socket.readyState !== WebSocket.OPEN) return

      pendingMessageRef.current = null
      socket.send(pending)
      appendMessage('sent', pending)
    },
    [appendMessage],
  )

  const invalidateGeneration = useCallback(() => {
    generationRef.current += 1
  }, [])

  const closeCurrentSocket = useCallback(() => {
    const socket = socketRef.current
    if (!socket) return
    teardownSocket(socket)
    if (socketRef.current === socket) {
      socketRef.current = null
    }
  }, [])

  const openSocket = useCallback(
    (options?: OpenSocketOptions) => {
      const announceConnecting = options?.announceConnecting ?? false
      const announceConnected = options?.announceConnected ?? true

      clearReconnectTimer()
      closeCurrentSocket()

      const generation = generationRef.current + 1
      generationRef.current = generation

      if (announceConnecting) {
        setStatus('connecting')
        appendMessage('system', `Connecting to ${wsUrl}…`)
      }

      const socket = new WebSocket(wsUrl)
      socketRef.current = socket

      const isActive = () => generation === generationRef.current

      bindSocketListeners(socket, {
        onOpen: () => {
          if (!isActive()) return
          setStatus('open')
          if (announceConnected) {
            appendMessage(
              'system',
              'Connected. Messages are echoed by the server.',
            )
          }
          flushPendingMessage(socket)
        },
        onMessage: (text) => {
          if (!isActive()) return
          appendMessage('received', text)
        },
        onClose: () => {
          if (!isActive()) return
          if (socketRef.current === socket) {
            socketRef.current = null
          }

          if (manualDisconnectRef.current) {
            manualDisconnectRef.current = false
            setStatus('closed')
            appendMessage('system', 'Disconnected.')
            return
          }

          if (!isPageActiveRef.current) {
            setStatus('idle')
            return
          }

          setStatus('connecting')
          appendMessage('system', 'Connection lost. Reconnecting…')
          reconnectTimerRef.current = window.setTimeout(() => {
            reconnectTimerRef.current = null
            if (!isPageActiveRef.current) return
            openSocketRef.current({
              announceConnecting: false,
              announceConnected: false,
            })
          }, 400)
        },
        onError: () => {
          if (!isActive()) return
          setStatus('error')
          appendMessage('system', 'WebSocket error. Reconnecting…')
        },
      })

      return socket
    },
    [
      appendMessage,
      clearReconnectTimer,
      closeCurrentSocket,
      flushPendingMessage,
      wsUrl,
    ],
  )

  useEffect(() => {
    openSocketRef.current = openSocket
  }, [openSocket])

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return
    manualDisconnectRef.current = false
    openSocket({ announceConnecting: true, announceConnected: true })
  }, [openSocket])

  const disconnect = useCallback(() => {
    clearReconnectTimer()
    manualDisconnectRef.current = true
    invalidateGeneration()
    closeCurrentSocket()
    setStatus('closed')
    appendMessage('system', 'Disconnected.')
  }, [
    appendMessage,
    clearReconnectTimer,
    closeCurrentSocket,
    invalidateGeneration,
  ])

  const sendMessage = useCallback(
    (rawText: string) => {
      const text = rawText.trim()
      if (!text) return

      const socket = socketRef.current
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(text)
        appendMessage('sent', text)
        return
      }

      pendingMessageRef.current = text
      manualDisconnectRef.current = false
      openSocket({ announceConnecting: false, announceConnected: false })
    },
    [appendMessage, openSocket],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  useEffect(() => {
    const handlePageHide = () => {
      clearReconnectTimer()
      invalidateGeneration()
      closeCurrentSocket()
    }

    window.addEventListener('pagehide', handlePageHide)
    return () => window.removeEventListener('pagehide', handlePageHide)
  }, [clearReconnectTimer, closeCurrentSocket, invalidateGeneration])

  const setPageActive = useCallback(
    (active: boolean) => {
      isPageActiveRef.current = active
      setIsPageActive(active)

      if (active) {
        const socket = socketRef.current
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          manualDisconnectRef.current = false
          openSocket({ announceConnecting: false, announceConnected: true })
        }
        return
      }

      clearReconnectTimer()
      pendingMessageRef.current = null
      invalidateGeneration()
      closeCurrentSocket()
      setStatus('idle')
    },
    [
      clearReconnectTimer,
      closeCurrentSocket,
      invalidateGeneration,
      openSocket,
    ],
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      wsUrl,
      status,
      messages,
      isConnected: status === 'open',
      isPageActive,
      setPageActive,
      connect,
      disconnect,
      sendMessage,
      clearMessages,
    }),
    [
      wsUrl,
      status,
      messages,
      isPageActive,
      setPageActive,
      connect,
      disconnect,
      sendMessage,
      clearMessages,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
