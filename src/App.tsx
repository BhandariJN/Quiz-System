import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AppRouter } from './routes'
import { useEffect } from 'react'
import { useAuthStore } from './features/auth/stores/authStore'

function App() {
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    setLoading(false)
  }, [setLoading])

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}

export default App
