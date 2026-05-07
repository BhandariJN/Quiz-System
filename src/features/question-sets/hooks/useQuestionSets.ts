import { useQuery } from '@tanstack/react-query'
import { questionSetApi } from '../services/questionSetApi'

export function useQuestionSets() {
  return useQuery({
    queryKey: ['questionSets'],
    queryFn: questionSetApi.getQuestionSets,
    staleTime: 10 * 60 * 1000,
  })
}

export function useQuestionSet(id: number) {
  return useQuery({
    queryKey: ['questionSet', id],
    queryFn: () => questionSetApi.getQuestionSetById(id),
    enabled: !!id,
  })
}
