import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  changeTheme: (newTheme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  changeTheme: () => Promise.resolve(),
})

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark')

  // Получаем тему с сервера
  useEffect(() => {
    // fetch("/api/profile")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTheme(data.theme);
    //   });
  }, [])

  // Меняем тему и сохраняем на сервере
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)

    // await fetch("/api/profile", {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ theme: newTheme }),
    // });
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
