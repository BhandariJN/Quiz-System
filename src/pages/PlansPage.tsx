import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAvailablePlans, useMySubscription } from '@/features/subscription/hooks/useSubscriptions'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Check, Crown, Loader2, Sparkles, Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { SubscriptionPlan } from '@/features/subscription/types/subscription.types'

const planIcons: Record<SubscriptionPlan, typeof Sparkles> = {
  SILVER: Zap,
  GOLD: Crown,
  PREMIUM: Sparkles,
}

const planColors: Record<SubscriptionPlan, string> = {
  SILVER: 'from-gray-400 to-gray-600',
  GOLD: 'from-yellow-400 to-yellow-600',
  PREMIUM: 'from-purple-400 to-purple-600',
}

export default function PlansPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { data: plansResponse, isLoading: plansLoading } = useAvailablePlans()
  const { data: mySubscription } = useMySubscription()
  const [hoveredPlan, setHoveredPlan] = useState<SubscriptionPlan | null>(null)

  // Handle both array and paginated responses
  const plans = Array.isArray(plansResponse) ? plansResponse : plansResponse?.content || []

  // Show empty state if no plans loaded
  if (!plansLoading && plans.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-muted-foreground">No plans available at the moment. Please check back later.</p>
        </div>
      </div>
    )
  }

  if (plansLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Unlock unlimited access to quizzes, detailed analytics, and personalized guidance 
          with our subscription plans.
        </p>
      </div>

      {/* Current Subscription Status */}
      {isAuthenticated && mySubscription?.isActive && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Your Current Plan</CardTitle>
                <p className="text-muted-foreground">{mySubscription.planName}</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p className="font-semibold">{formatDate(mySubscription.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining Days</p>
                <p className="font-semibold">{mySubscription.remainingDays} days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Quota</p>
                <p className="font-semibold">
                  {mySubscription.quizzesUsedThisMonth} / {mySubscription.quizzesLimitPerMonth} quizzes
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Usage</span>
                <span>
                  {Math.round((mySubscription.quizzesUsedThisMonth / mySubscription.quizzesLimitPerMonth) * 100)}%
                </span>
              </div>
              <Progress 
                value={(mySubscription.quizzesUsedThisMonth / mySubscription.quizzesLimitPerMonth) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = planIcons[plan.plan] || Zap
          const isCurrentPlan = mySubscription?.currentPlan === plan.plan
          const isPopular = plan.plan === 'GOLD'

          return (
            <Card
              key={plan.plan}
              className={`relative transition-all duration-300 ${
                isPopular ? 'border-primary shadow-lg scale-105' : ''
              } ${hoveredPlan === plan.plan ? 'shadow-xl' : ''}`}
              onMouseEnter={() => setHoveredPlan(plan.plan)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${planColors[plan.plan] || 'from-gray-400 to-gray-600'} text-white mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">{plan.name || plan.plan}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">NPR {plan.price || 0}</span>
                  <span className="text-muted-foreground">/{plan.durationDays || 30} days</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  <p>Up to {plan.maxQuizzesPerMonth || 0} quizzes per month</p>
                  <p>Max {plan.maxQuestionsPerQuiz || 0} questions per quiz</p>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : isAuthenticated ? (
                  <Button className="w-full" asChild>
                    <Link to={`/checkout?plan=${plan.plan}`}>
                      {mySubscription?.currentPlan && plan.plan > mySubscription.currentPlan
                        ? 'Upgrade'
                        : 'Subscribe'}
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link to="/login">Sign In to Subscribe</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Can I change plans?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade at any time. Upgrades are prorated based on remaining days.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">What happens when my plan expires?</h3>
            <p className="text-sm text-muted-foreground">
              Your access will be limited to free features. You can renew anytime to restore full access.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Is there a refund policy?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 7-day money-back guarantee if you're not satisfied with your subscription.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time from your dashboard settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
