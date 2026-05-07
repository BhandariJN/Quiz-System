import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../services/dashboardApi'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePerformanceTrend(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['performanceTrend', period],
    queryFn: () => dashboardApi.getPerformanceTrend(period),
    staleTime: 10 * 60 * 1000,
  })
}
