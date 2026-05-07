import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import { SubscriptionPlanResponse, SubscriptionStatusResponse, UpgradePriceResponse, SubscriptionPlan } from '../types/subscription.types'

export const subscriptionApi = {
  getMySubscription: async () => {
    const response = await api.get<ApiResponse<SubscriptionStatusResponse>>('/subscriptions/me')
    return response.data.data
  },

  getAvailablePlans: async () => {
    const response = await api.get<ApiResponse<SubscriptionPlanResponse[]>>('/subscriptions/plans')
    return response.data.data
  },

  getUpgradePrice: async (targetPlan: SubscriptionPlan) => {
    const response = await api.get<ApiResponse<UpgradePriceResponse>>(`/subscriptions/upgrade-price/${targetPlan}`)
    return response.data.data
  },
}
