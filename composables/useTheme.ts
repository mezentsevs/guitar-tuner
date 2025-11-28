export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')

  const setTheme = (newTheme: 'light' | 'dark'): void => {
    theme.value = newTheme
    if (process.client) {
      localStorage.setItem('theme', newTheme)
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const toggleTheme = (): void => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  onMounted((): void => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
      setTheme(initialTheme)
    }
  })

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme
  }
}
