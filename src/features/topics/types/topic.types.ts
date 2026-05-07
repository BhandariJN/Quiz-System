export interface Topic {
  topicId: string
  topicName: string
  description?: string
  categoryId?: number
  categoryName?: string
  questionCount: number
  entranceTypeIds?: number[]
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  categoryId: number
  categoryName: string
  description?: string
  slug?: string
  topicCount: number
}

export interface TopicRequest {
  topicName: string
  description?: string
  categoryId?: number
  entranceTypeIds?: number[]
}

export interface TopicBatchResult {
  successCount: number
  failedCount: number
  successTopics: Topic[]
  failedTopics: Array<{
    request: TopicRequest
    error: string
  }>
}

export interface TopicWithSubjects {
  subjectId: number
  subjectName: string
  topics: Topic[]
  topicCount: number
}

export interface TopicFilters {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}
