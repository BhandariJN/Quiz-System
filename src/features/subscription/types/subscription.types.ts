export type SubscriptionPlan = 'SILVER' | 'GOLD' | 'PREMIUM'

export interface SubscriptionPlanResponse {
  plan: SubscriptionPlan
  name: string
  price: number
  durationDays: number
  features: string[]
  maxQuizzesPerMonth: number
  maxQuestionsPerQuiz: number
  analyticsEnabled: boolean
  mentorSupport: boolean
}

export interface SubscriptionStatusResponse {
  currentPlan: SubscriptionPlan
  planName: string
  startDate: string
  endDate: string
  remainingDays: number
  quizzesUsedThisMonth: number
  quizzesLimitPerMonth: number
  isActive: boolean
  autoRenew: boolean
}

export interface UpgradePriceResponse {
  currentPlan: SubscriptionPlan
  targetPlan: SubscriptionPlan
  currentPlanRemainingDays: number
  currentPlanDailyRate: number
  currentPlanCredit: number
  targetPlanPrice: number
  finalUpgradePrice: number
  currency: string
}
