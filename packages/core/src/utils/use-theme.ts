import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export interface UseThemeOptions {
  /**
   * Storage key for localStorage (default: 'luman-theme')
   */
  storageKey?: string

  /**
   * Default mode (default: 'system')
   */
  defaultMode?: ThemeMode
}

/**
 * Hook for managing theme mode with localStorage persistence and system preference support.
 *
 * Features:
 * - No context provider (no re-renders)
 * - localStorage persistence
 * - SSR-safe with proper hydration
 * - Listens to system preference changes
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { mode, setMode, resolvedTheme } = useTheme()
 *
 *   return (
 *     <div>
 *       <button onClick={() => setMode('light')}>Light</button>
 *       <button onClick={() => setMode('dark')}>Dark</button>
 *       <button onClick={() => setMode('system')}>System</button>
 *       <p>Current theme: {resolvedTheme}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTheme(options: UseThemeOptions = {}) {
  const { storageKey = "luman-theme", defaultMode = "system" } = options

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode
    return (localStorage.getItem(storageKey) as ThemeMode) || defaultMode
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newMode)
    }
  }

  useEffect(() => {
    const updateTheme = () => {
      let resolved: ResolvedTheme = "light"

      if (mode === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        resolved = mediaQuery.matches ? "dark" : "light"
      } else {
        resolved = mode
      }

      // Update data attribute
      document.documentElement.dataset.theme = resolved
      setResolvedTheme(resolved)
    }

    updateTheme()

    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", updateTheme)
      return () => mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [mode])

  return { mode, setMode, resolvedTheme }
}
