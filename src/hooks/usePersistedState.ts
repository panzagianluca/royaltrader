import { useEffect, useState } from "react"

/**
 * Persist React state to localStorage so it survives reloads.
 * Safely handles SSR and JSON parse errors.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue
    }
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch (_) {
      // ignore
    }
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (_) {
      // ignore write errors (quota, etc.)
    }
  }, [key, value])

  return [value, setValue]
} 