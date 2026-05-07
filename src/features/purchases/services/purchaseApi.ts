import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'

export type PurchaseStatus = 'NOT_PURCHASED' | 'PENDING' | 'PAID' | 'APPROVAL_PENDING' | 'FAILED'

export interface QuizPurchaseStatus {
  status: PurchaseStatus
  purchaseId?: number
  purchaseDate?: string
  amountPaid?: number
}

export interface MyQuizPurchase {
  purchaseId: number
  purchaseStatus: PurchaseStatus
  purchaseDate: string
  amountPaid: number
  quizId: number
  quizName: string
  quizSlug: string
  nosOfQuestions: number
  durationInMinutes: number
  quizPrice: number
  courseId?: number
  courseName?: string
}

export const purchaseApi = {
  getQuizPurchaseStatus: async (quizId: number) => {
    const response = await api.get<ApiResponse<QuizPurchaseStatus>>(`/purchases/quizzes/${quizId}/status`)
    return response.data.data
  },

  getMyQuizPurchases: async () => {
    const response = await api.get<ApiResponse<MyQuizPurchase[]>>('/purchases/me/quizzes')
    return response.data.data
  },
}
