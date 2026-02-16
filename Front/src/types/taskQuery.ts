import type { SortDirection } from './pagination.ts'
import type { TaskPriority, TaskSortBy, TaskStatus } from './task.ts'

export interface TaskQueryParameters {
  pageNumber?: number
  pageSize?: number
  status?: TaskStatus
  priority?: TaskPriority
  searchTerm?: string
  sortBy?: TaskSortBy
  sortDirection?: SortDirection
}

