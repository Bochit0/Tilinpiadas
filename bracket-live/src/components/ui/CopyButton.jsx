import { useEffect, useRef, useState } from 'react'
import { cx } from '../../utils/cx'
import { copyText } from '../../utils/clipboard'
import { CheckIcon, CopyIcon } from './icons'

/**
 * Botón "Copiar" con feedback inmediato: pasa de neutro a verde con check y "¡Copiado!"
 * durante 2 s (y a rojo si el navegador no permite copiar).
 */
export default function CopyButton({ text, label = 'Copiar', ariaLabel, className }) {
  const [status, setStatus] = useState('idle') // idle | copied | error
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = async () => {
    setStatus((await copyText(text)) ? 'copied' : 'error')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cx(
        'inline-flex min-w-28 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95',
        status === 'idle' && 'border-edge bg-panel text-white hover:bg-hover',
        status === 'copied' && 'scale-105 border-success bg-success text-white',
        status === 'error' && 'border-danger bg-danger text-white',
        className,
      )}
    >
      {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
      {status === 'copied' ? '¡Copiado!' : status === 'error' ? 'Copia manual' : label}
      <span role="status" className="sr-only">
        {status === 'copied' ? 'Enlace copiado al portapapeles' : ''}
      </span>
    </button>
  )
}
