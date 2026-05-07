import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '@/hooks/useToast'
import { LoginCredentials, RegisterCredentials } from '../types/auth.types'

export function useLogin() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Construct minimal user from API response
      const user = {
        userId: data.userId,
        email: '', // Will be populated by getCurrentUser
        fullname: '',
        roles: ['USER'],
      }
      setAuth(user, data.accessToken, data.refreshToken)
      toast({
        title: 'Welcome back!',
        description: 'Login successful',
      })
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      })
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const user = {
        userId: data.userId,
        email: '',
        fullname: '',
        roles: ['USER'],
      }
      setAuth(user, data.accessToken, data.refreshToken)
      toast({
        title: 'Account created!',
        description: 'Welcome to Entrance Gateway',
      })
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      })
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const logout = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast({
        title: 'Logged out',
        description: 'See you soon!',
      })
      navigate('/login')
    },
    onError: () => {
      logout()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
