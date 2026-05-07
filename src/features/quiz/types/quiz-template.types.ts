export type QuizTemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type QuizTemplateType = 'PRACTICE' | 'COMPETITIVE'

import type { QuizConfigDTO } from './quiz.types'

export interface QuizTemplateRequest {
  name: string
  description?: string
  type: QuizTemplateType
  entryFee: number
  config: QuizConfigDTO
  status?: QuizTemplateStatus
  entranceTypeId?: number
}

export interface EntranceTypeSummary {
  entranceTypeId: number
  entranceName: string
  slug: string
}

export interface QuizTemplateResponse {
  templateId: string
  name: string
  description?: string
  type: QuizTemplateType
  entryFee: number
  config: QuizConfigDTO
  status: QuizTemplateStatus
  createdAt: string
  updatedAt: string
  createdBy?: string
  entranceType?: EntranceTypeSummary
}

export interface QuizTemplateBatchResult {
  successCount: number
  failedCount: number
  successTemplates: QuizTemplateResponse[]
  failedTemplates: Array<{
    request: QuizTemplateRequest
    error: string
  }>
}

export interface PageMetadata {
  total: number
  created: number
  failed: number
}

export interface QuizTemplateFilters {
  status?: QuizTemplateStatus
  type?: QuizTemplateType
  entranceTypeId?: number
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}
