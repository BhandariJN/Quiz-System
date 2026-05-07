import api from '@/lib/axios'
import { ApiResponse, PageResponse } from '@/types/api.types'
import { Topic, Category, TopicRequest, TopicBatchResult, TopicWithSubjects, TopicFilters } from '../types/topic.types'

export const topicApi = {
  // Get all topics with pagination (filtered by subscription)
  getTopics: async (filters: TopicFilters = {}) => {
    const { page = 0, size = 50, sortBy = 'topicName', sortDir = 'asc' } = filters
    const response = await api.get<ApiResponse<PageResponse<Topic>>>(
      `/topics?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Get topic by ID
  getTopicById: async (topicId: string) => {
    const response = await api.get<ApiResponse<Topic>>(`/topics/${topicId}`)
    return response.data.data
  },

  // Get all topics without pagination
  getAllTopicsNoPagination: async () => {
    const response = await api.get<ApiResponse<Topic[]>>('/topics/all')
    return response.data.data
  },

  // Search topics by name
  searchTopics: async (keyword: string) => {
    const response = await api.get<ApiResponse<Topic[]>>(`/topics/search?keyword=${encodeURIComponent(keyword)}`)
    return response.data.data
  },

  // Get topic by name
  getTopicByName: async (topicName: string) => {
    const response = await api.get<ApiResponse<Topic>>(`/topics/by-name/${encodeURIComponent(topicName)}`)
    return response.data.data
  },

  // Get topics by subject/category
  getTopicsBySubject: async (categoryId: number) => {
    const response = await api.get<ApiResponse<Topic[]>>(`/topics/by-subject/${categoryId}`)
    return response.data.data
  },

  // Search topics within a subject
  searchTopicsBySubject: async (categoryId: number, keyword: string) => {
    const response = await api.get<ApiResponse<Topic[]>>(
      `/topics/by-subject/${categoryId}/search?keyword=${encodeURIComponent(keyword)}`
    )
    return response.data.data
  },

  // Get topics organized by subjects
  getTopicsWithSubjects: async () => {
    const response = await api.get<ApiResponse<TopicWithSubjects[]>>('/topics/with-subjects')
    return response.data.data
  },

  // Resolve topic names to IDs
  resolveTopicNames: async (topicNames: string[]) => {
    const response = await api.post<ApiResponse<Record<string, string>>>('/topics/resolve-names', topicNames)
    return response.data.data
  },

  // Create topics (Admin only)
  createTopics: async (requests: TopicRequest[]) => {
    const response = await api.post<ApiResponse<TopicBatchResult>>('/topics', requests)
    return response.data.data
  },

  // Update topic (Admin only)
  updateTopic: async (topicId: string, request: TopicRequest) => {
    const response = await api.put<ApiResponse<Topic>>(`/topics/${topicId}`, request)
    return response.data.data
  },

  // Delete topic (Admin only)
  deleteTopic: async (topicId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/topics/${topicId}`)
    return response.data.data
  },

  // Get topics by entrance type
  getTopicsByEntranceType: async (entranceSlug: string) => {
    const response = await api.get<ApiResponse<Topic[]>>(`/topics/by-entrance/${entranceSlug}`)
    return response.data.data
  },

  // Get topics by entrance type and category
  getTopicsByEntranceTypeAndCategory: async (entranceSlug: string, categoryId: number) => {
    const response = await api.get<ApiResponse<Topic[]>>(`/topics/by-entrance/${entranceSlug}/category/${categoryId}`)
    return response.data.data
  },

  // Categories
  getCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories')
    return response.data.data
  },

  getCategoriesNoPagination: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories/all')
    return response.data.data
  },
}
