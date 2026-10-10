import { useEffect, useState } from 'react'

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback() : JSON.parse(raw)
  } catch {
    // storage bloqueado o JSON corrupto: se usa el valor inicial
    return fallback()
  }
}

/**
 * useState que se persiste en localStorage.
 * @template T
 * @param {string} key clave de almacenamiento (versionada: 'app:recurso:v1')
 * @param {() => T} getInitial función que devuelve el valor inicial (solo se llama si hace falta)
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]}
 */
export function useLocalStorage(key, getInitial) {
  const [value, setValue] = useState(() => read(key, getInitial))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // sin storage la app sigue funcionando, solo no persiste
    }
  }, [key, value])

  return [value, setValue]
}
