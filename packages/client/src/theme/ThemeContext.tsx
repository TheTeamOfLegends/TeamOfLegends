import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  changeTheme: (newTheme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  changeTheme: () => undefined,
})

type ThemeProviderProps = {
  children: ReactNode
}

const THEME_STORAGE_KEY = 'theme'

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark')

  // Временно вместо сервера используем localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    }
  }, [])

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
