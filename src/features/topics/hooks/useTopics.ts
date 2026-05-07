import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { topicApi } from '../services/topicApi'
import { useToast } from '@/hooks/useToast'
import { TopicRequest, TopicFilters } from '../types/topic.types'

export function useTopics(filters: TopicFilters = {}) {
  return useQuery({
    queryKey: ['topics', filters],
    queryFn: () => topicApi.getTopics(filters),
    staleTime: 30 * 60 * 1000,
  })
}

export function useTopic(topicId: string) {
  return useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicApi.getTopicById(topicId),
    enabled: !!topicId,
  })
}

export function useAllTopicsNoPagination() {
  return useQuery({
    queryKey: ['topics', 'all'],
    queryFn: topicApi.getAllTopicsNoPagination,
    staleTime: 30 * 60 * 1000,
  })
}

export function useSearchTopics(keyword: string) {
  return useQuery({
    queryKey: ['topics', 'search', keyword],
    queryFn: () => topicApi.searchTopics(keyword),
    enabled: !!keyword && keyword.length > 0,
  })
}

export function useTopicByName(topicName: string) {
  return useQuery({
    queryKey: ['topic', 'name', topicName],
    queryFn: () => topicApi.getTopicByName(topicName),
    enabled: !!topicName,
  })
}

export function useTopicsBySubject(categoryId: number) {
  return useQuery({
    queryKey: ['topics', 'subject', categoryId],
    queryFn: () => topicApi.getTopicsBySubject(categoryId),
    enabled: !!categoryId,
  })
}

export function useSearchTopicsBySubject(categoryId: number, keyword: string) {
  return useQuery({
    queryKey: ['topics', 'subject', categoryId, 'search', keyword],
    queryFn: () => topicApi.searchTopicsBySubject(categoryId, keyword),
    enabled: !!categoryId && !!keyword,
  })
}

export function useTopicsWithSubjects() {
  return useQuery({
    queryKey: ['topics', 'with-subjects'],
    queryFn: topicApi.getTopicsWithSubjects,
    staleTime: 30 * 60 * 1000,
  })
}

export function useTopicsByEntranceType(entranceSlug: string) {
  return useQuery({
    queryKey: ['topics', 'entrance', entranceSlug],
    queryFn: () => topicApi.getTopicsByEntranceType(entranceSlug),
    enabled: !!entranceSlug,
  })
}

export function useTopicsByEntranceTypeAndCategory(entranceSlug: string, categoryId: number) {
  return useQuery({
    queryKey: ['topics', 'entrance', entranceSlug, 'category', categoryId],
    queryFn: () => topicApi.getTopicsByEntranceTypeAndCategory(entranceSlug, categoryId),
    enabled: !!entranceSlug && !!categoryId,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: topicApi.getCategories,
    staleTime: 30 * 60 * 1000,
  })
}

export function useCategoriesNoPagination() {
  return useQuery({
    queryKey: ['categories', 'all'],
    queryFn: topicApi.getCategoriesNoPagination,
    staleTime: 30 * 60 * 1000,
  })
}

export function useCreateTopics() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: topicApi.createTopics,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: 'Topics Created',
        description: `Successfully created ${data.successCount} of ${data.successCount + data.failedCount} topics.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Create Topics',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateTopic() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, request }: { topicId: string; request: TopicRequest }) =>
      topicApi.updateTopic(topicId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({
        title: 'Topic Updated',
        description: 'Topic has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Update Topic',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteTopic() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: topicApi.deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      toast({
        title: 'Topic Deleted',
        description: 'Topic has been deleted successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Delete Topic',
        description: error.message,
        variant: 'destructive',
      })
    },
  })
}
