export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

export interface FilterParams {
  search?: string
  status?: string
  type?: string
  [key: string]: string | undefined
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
