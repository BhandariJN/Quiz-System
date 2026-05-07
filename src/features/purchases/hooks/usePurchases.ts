import { useQuery } from '@tanstack/react-query'
import { purchaseApi } from '../services/purchaseApi'

export function useQuizPurchaseStatus(quizId: number) {
  return useQuery({
    queryKey: ['quizPurchaseStatus', quizId],
    queryFn: () => purchaseApi.getQuizPurchaseStatus(quizId),
    enabled: !!quizId,
  })
}

export function useMyQuizPurchases() {
  return useQuery({
    queryKey: ['myQuizPurchases'],
    queryFn: purchaseApi.getMyQuizPurchases,
    staleTime: 5 * 60 * 1000,
  })
}
