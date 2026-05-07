import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import { QuestionSet, QuestionSetDetail } from '../types/questionSet.types'

export const questionSetApi = {
  getQuestionSets: async () => {
    const response = await api.get<ApiResponse<QuestionSet[]>>('/question-sets')
    return response.data.data
  },

  getQuestionSetById: async (id: number) => {
    const response = await api.get<ApiResponse<QuestionSetDetail>>(`/question-sets/${id}`)
    return response.data.data
  },
}
