import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '../services/subscriptionApi'
import { SubscriptionPlan } from '../types/subscription.types'

export function useMySubscription() {
  return useQuery({
    queryKey: ['mySubscription'],
    queryFn: subscriptionApi.getMySubscription,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAvailablePlans() {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: subscriptionApi.getAvailablePlans,
    staleTime: 30 * 60 * 1000,
  })
}

export function useUpgradePrice(targetPlan: SubscriptionPlan) {
  return useQuery({
    queryKey: ['upgradePrice', targetPlan],
    queryFn: () => subscriptionApi.getUpgradePrice(targetPlan),
    enabled: !!targetPlan,
  })
}
