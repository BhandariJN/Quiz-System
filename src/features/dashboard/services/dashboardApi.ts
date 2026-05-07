import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'

export interface DashboardStats {
  totalQuizzesTaken: number
  totalQuizzesPassed: number
  averageScore: number
  totalTimeSpent: number
  currentStreak: number
  bestStreak: number
}

export interface PerformanceTrend {
  date: string
  score: number
  quizCount: number
}

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    return response.data.data
  },

  getPerformanceTrend: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await api.get<ApiResponse<PerformanceTrend[]>>(
      `/dashboard/performance?period=${period}`
    )
    return response.data.data
  },
}
