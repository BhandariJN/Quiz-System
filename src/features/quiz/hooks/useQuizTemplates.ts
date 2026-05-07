import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quizTemplateApi } from '../services/quizTemplateApi'
import { useToast } from '@/hooks/useToast'
import { QuizTemplateRequest, QuizTemplateFilters, QuizTemplateStatus, QuizTemplateType } from '../types/quiz-template.types'

export function useCreateQuizTemplates() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizTemplateApi.createTemplates,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quizTemplates'] })
      toast({
        title: 'Templates Created',
        description: `Successfully created ${data.successCount} of ${data.successCount + data.failedCount} templates.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Create Templates',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateQuizTemplate() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ templateId, request }: { templateId: string; request: QuizTemplateRequest }) =>
      quizTemplateApi.updateTemplate(templateId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizTemplates'] })
      toast({
        title: 'Template Updated',
        description: 'Quiz template has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update Template',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useQuizTemplate(templateId: string) {
  return useQuery({
    queryKey: ['quizTemplate', templateId],
    queryFn: () => quizTemplateApi.getTemplateById(templateId),
    enabled: !!templateId,
  })
}

export function useQuizTemplates(filters: QuizTemplateFilters = {}) {
  return useQuery({
    queryKey: ['quizTemplates', filters],
    queryFn: () => quizTemplateApi.getAllTemplates(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useQuizTemplatesByStatus(status: QuizTemplateStatus, filters: Omit<QuizTemplateFilters, 'status'> = {}) {
  return useQuery({
    queryKey: ['quizTemplates', 'status', status, filters],
    queryFn: () => quizTemplateApi.getTemplatesByStatus(status, filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useQuizTemplatesByType(type: QuizTemplateType, filters: Omit<QuizTemplateFilters, 'type'> = {}) {
  return useQuery({
    queryKey: ['quizTemplates', 'type', type, filters],
    queryFn: () => quizTemplateApi.getTemplatesByType(type, filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePublishedTemplates(type: QuizTemplateType, filters: Omit<QuizTemplateFilters, 'type'> = {}) {
  return useQuery({
    queryKey: ['quizTemplates', 'published', type, filters],
    queryFn: () => quizTemplateApi.getPublishedTemplates(type, filters),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePublishQuizTemplate() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizTemplateApi.publishTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizTemplates'] })
      toast({
        title: 'Template Published',
        description: 'Quiz template is now live and available to users.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Publish',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUnpublishQuizTemplate() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizTemplateApi.unpublishTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizTemplates'] })
      toast({
        title: 'Template Unpublished',
        description: 'Quiz template is now hidden from users.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Unpublish',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteQuizTemplate() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quizTemplateApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizTemplates'] })
      toast({
        title: 'Template Deleted',
        description: 'Quiz template has been archived.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Delete',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useQuizTemplatesByEntranceType(entranceSlug: string, filters: Omit<QuizTemplateFilters, 'entranceTypeId'> = {}) {
  return useQuery({
    queryKey: ['quizTemplates', 'entrance', entranceSlug, filters],
    queryFn: () => quizTemplateApi.getTemplatesByEntranceType(entranceSlug, filters),
    enabled: !!entranceSlug,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGlobalTemplates(filters: Omit<QuizTemplateFilters, 'status' | 'type'> = {}) {
  return useQuery({
    queryKey: ['quizTemplates', 'global', filters],
    queryFn: () => quizTemplateApi.getGlobalTemplates(filters),
    staleTime: 10 * 60 * 1000,
  })
}
