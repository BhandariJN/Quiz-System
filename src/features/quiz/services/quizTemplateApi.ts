import api from '@/lib/axios'
import { ApiResponse, PageResponse } from '@/types/api.types'
import {
  QuizTemplateRequest,
  QuizTemplateResponse,
  QuizTemplateBatchResult,
  QuizTemplateFilters,
  QuizTemplateStatus,
  QuizTemplateType,
} from '../types/quiz-template.types'

export const quizTemplateApi = {
  // Create single or multiple templates (Admin only)
  createTemplates: async (requests: QuizTemplateRequest[]) => {
    const response = await api.post<ApiResponse<QuizTemplateBatchResult>>('/quiz-templates', requests)
    return response.data.data
  },

  // Update template (Admin only)
  updateTemplate: async (templateId: string, request: QuizTemplateRequest) => {
    const response = await api.put<ApiResponse<QuizTemplateResponse>>(`/quiz-templates/${templateId}`, request)
    return response.data.data
  },

  // Get template by ID
  getTemplateById: async (templateId: string) => {
    const response = await api.get<ApiResponse<QuizTemplateResponse>>(`/quiz-templates/${templateId}`)
    return response.data.data
  },

  // Get all templates with pagination
  getAllTemplates: async (filters: QuizTemplateFilters = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Get templates by status
  getTemplatesByStatus: async (status: QuizTemplateStatus, filters: Omit<QuizTemplateFilters, 'status'> = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates/status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Get templates by type (PRACTICE/COMPETITIVE)
  getTemplatesByType: async (type: QuizTemplateType, filters: Omit<QuizTemplateFilters, 'type'> = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates/type/${type}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Get published templates by type
  getPublishedTemplates: async (type: QuizTemplateType, filters: Omit<QuizTemplateFilters, 'type'> = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates/published/${type}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Publish template (Admin only)
  publishTemplate: async (templateId: string) => {
    const response = await api.patch<ApiResponse<QuizTemplateResponse>>(`/quiz-templates/${templateId}/publish`)
    return response.data.data
  },

  // Unpublish template (Admin only)
  unpublishTemplate: async (templateId: string) => {
    const response = await api.patch<ApiResponse<QuizTemplateResponse>>(`/quiz-templates/${templateId}/unpublish`)
    return response.data.data
  },

  // Delete template (Admin only)
  deleteTemplate: async (templateId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/quiz-templates/${templateId}`)
    return response.data.data
  },

  // Get templates by entrance type
  getTemplatesByEntranceType: async (entranceSlug: string, filters: Omit<QuizTemplateFilters, 'entranceTypeId'> = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates/entrance/${entranceSlug}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Get templates by entrance type and status
  getTemplatesByEntranceTypeAndStatus: async (
    entranceSlug: string,
    status: QuizTemplateStatus,
    filters: Omit<QuizTemplateFilters, 'entranceTypeId' | 'status'> = {}
  ) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates/entrance/${entranceSlug}/status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },

  // Get global templates
  getGlobalTemplates: async (filters: Omit<QuizTemplateFilters, 'status' | 'type'> = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = filters
    const response = await api.get<ApiResponse<PageResponse<QuizTemplateResponse>>>(
      `/quiz-templates/global?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    return response.data.data
  },
}
