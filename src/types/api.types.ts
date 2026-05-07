export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  metadata?: Record<string, unknown>
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  pageNumber: number
  pageSize: number
  last: boolean
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
