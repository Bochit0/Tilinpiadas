import { useCallback, useEffect, useRef } from 'react'

/**
 * Canal BroadcastChannel entre pestañas/ventanas del MISMO navegador y origen.
 * Devuelve `post(data)` para enviar; `onMessage(data)` se llama con lo recibido
 * de las demás pestañas (nunca de la propia).
 *
 * @param {string} name nombre del canal
 * @param {(data: any) => void} onMessage
 */
export function useBroadcast(name, onMessage) {
  const channelRef = useRef(null)
  const handlerRef = useRef(onMessage)

  useEffect(() => {
    handlerRef.current = onMessage
  })

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return undefined

    const channel = new BroadcastChannel(name)
    channel.onmessage = (event) => handlerRef.current?.(event.data)
    channelRef.current = channel

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [name])

  return useCallback((data) => channelRef.current?.postMessage(data), [])
}
