import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth.types'

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data.data
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials)
    return response.data.data
  },

  logout: async () => {
    await api.post('/auth/logout')
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data.data
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data
  },
}
