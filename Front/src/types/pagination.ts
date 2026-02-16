export type SortDirection = 'asc' | 'desc'

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

