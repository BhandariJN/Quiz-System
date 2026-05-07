import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quizApi } from '../services/quizApi'
import { useToast } from '@/hooks/useToast'

export function useQuizTemplates() {
  return useQuery({
    queryKey: ['quizTemplates'],
    queryFn: quizApi.getTemplates,
    staleTime: 5 * 60 * 1000,
  })
}

export function useQuizTemplate(templateId: string) {
  return useQuery({
    queryKey: ['quizTemplate', templateId],
    queryFn: () => quizApi.getTemplateById(templateId),
    enabled: !!templateId,
  })
}

export function useGenerateQuizFromTemplate() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizApi.generateFromTemplate,
    onSuccess: (data) => {
      queryClient.setQueryData(['activeQuiz', data.attemptId], data)
      toast({
        title: 'Quiz Generated',
        description: 'Your quiz is ready to start!',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Generate Quiz',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useGenerateCustomQuiz() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: quizApi.generateCustom,
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || error.message || 'Failed to generate quiz'
      toast({
        title: 'Failed to Generate Quiz',
        description: message,
        variant: 'destructive',
      })
    },
  })
}

export function useGenerateCustomQuizForEntrance() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      entranceSlug,
      config,
    }: {
      entranceSlug: string
      config: import('../types/quiz.types').QuizConfigDTO
    }) => quizApi.generateCustomForEntrance(entranceSlug, config),
    onSuccess: (data) => {
      queryClient.setQueryData(['activeQuiz', data.attemptId], data)
      toast({
        title: 'Quiz Generated',
        description: 'Your custom quiz is ready to start!',
      })
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || error.message || 'Failed to generate quiz'
      toast({
        title: 'Failed to Generate Quiz',
        description: message,
        variant: 'destructive',
      })
    },
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      attemptId,
      answers,
    }: {
      attemptId: string
      answers: Array<{ questionId: number; selectedOptionId: number }>
    }) => quizApi.submitQuiz(attemptId, answers),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizHistory'] })
      queryClient.invalidateQueries({ queryKey: ['quizAttempts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.removeQueries({ queryKey: ['activeQuiz', variables.attemptId] })

      toast({
        title: 'Quiz Submitted',
        description: `You scored ${data.score}%`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useQuizHistory() {
  return useQuery({
    queryKey: ['quizHistory'],
    queryFn: quizApi.getQuizHistory,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategoryAnalysis() {
  return useQuery({
    queryKey: ['categoryAnalysis'],
    queryFn: quizApi.getCategoryAnalysis,
    staleTime: 10 * 60 * 1000,
  })
}

export function useQuizAttempt(attemptId: string) {
  return useQuery({
    queryKey: ['quizAttempt', attemptId],
    queryFn: () => quizApi.getAttemptById(attemptId),
    enabled: !!attemptId,
  })
}

export function useDeleteUserTemplate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: quizApi.deleteUserTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizTemplates'] })
      queryClient.invalidateQueries({ queryKey: ['userTemplates'] })
      toast({
        title: 'Template Archived',
        description: 'Your template has been archived successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Archive Template',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUserTemplates() {
  return useQuery({
    queryKey: ['userTemplates'],
    queryFn: quizApi.getUserTemplates,
    staleTime: 5 * 60 * 1000,
  })
}
