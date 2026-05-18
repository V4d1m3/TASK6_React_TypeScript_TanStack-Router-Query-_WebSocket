const readEnv = (key: keyof ImportMetaEnv, fallback: string): string => {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const env = {
  dummyJsonBaseUrl: readEnv('VITE_DUMMYJSON_BASE_URL', 'https://dummyjson.com'),
  wsUrl: readEnv('VITE_WS_URL', 'wss://ws.ifelse.io'),
} as const
