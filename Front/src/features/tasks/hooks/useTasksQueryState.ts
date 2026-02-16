import { useEffect, useMemo, useState } from 'react'
import type { SortDirection, TaskPriority, TaskSortBy, TaskStatus } from '../../../types/index.ts'

export type TasksQueryState = {
  pageNumber: number
  pageSize: number
  status?: TaskStatus
  priority?: TaskPriority
  searchTerm?: string
  sortBy: TaskSortBy
  sortDirection: SortDirection
}

const DEFAULTS: TasksQueryState = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'CreatedAt',
  sortDirection: 'desc',
}

const VALID_STATUS: readonly TaskStatus[] = ['Todo', 'InProgress', 'Done']
const VALID_PRIORITY: readonly TaskPriority[] = ['Low', 'Medium', 'High']
const VALID_SORT_BY: readonly TaskSortBy[] = ['CreatedAt', 'DueDate', 'Priority']
const VALID_SORT_DIRECTION: readonly SortDirection[] = ['asc', 'desc']

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseQueryFromLocation(): TasksQueryState {
  const params = new URLSearchParams(window.location.search)

  const pageNumberRaw = Number(params.get('pageNumber') ?? DEFAULTS.pageNumber)
  const pageSizeRaw = Number(params.get('pageSize') ?? DEFAULTS.pageSize)
  const pageNumber = clampInt(Number.isFinite(pageNumberRaw) ? pageNumberRaw : DEFAULTS.pageNumber, 1, 1_000_000)
  const pageSize = clampInt(Number.isFinite(pageSizeRaw) ? pageSizeRaw : DEFAULTS.pageSize, 1, 100)

  const status = params.get('status')
  const priority = params.get('priority')

  const sortBy = params.get('sortBy')
  const sortDirection = params.get('sortDirection')

  const searchTerm = params.get('searchTerm') ?? undefined

  return {
    pageNumber,
    pageSize,
    status: status && (VALID_STATUS as readonly string[]).includes(status) ? (status as TaskStatus) : undefined,
    priority:
      priority && (VALID_PRIORITY as readonly string[]).includes(priority) ? (priority as TaskPriority) : undefined,
    searchTerm: searchTerm && searchTerm.trim().length ? searchTerm : undefined,
    sortBy: sortBy && (VALID_SORT_BY as readonly string[]).includes(sortBy) ? (sortBy as TaskSortBy) : DEFAULTS.sortBy,
    sortDirection:
      sortDirection && (VALID_SORT_DIRECTION as readonly string[]).includes(sortDirection)
        ? (sortDirection as SortDirection)
        : DEFAULTS.sortDirection,
  }
}

function toSearchString(query: TasksQueryState): string {
  const params = new URLSearchParams()

  if (query.pageNumber !== DEFAULTS.pageNumber) params.set('pageNumber', String(query.pageNumber))
  if (query.pageSize !== DEFAULTS.pageSize) params.set('pageSize', String(query.pageSize))

  if (query.status) params.set('status', query.status)
  if (query.priority) params.set('priority', query.priority)
  if (query.searchTerm) params.set('searchTerm', query.searchTerm)

  if (query.sortBy !== DEFAULTS.sortBy) params.set('sortBy', query.sortBy)
  if (query.sortDirection !== DEFAULTS.sortDirection) params.set('sortDirection', query.sortDirection)

  const str = params.toString()
  return str.length ? `?${str}` : ''
}

export function useTasksQueryState() {
  const [query, setQuery] = useState<TasksQueryState>(() => parseQueryFromLocation())

  // Keep state in sync with back/forward navigation.
  useEffect(() => {
    const onPopState = () => setQuery(parseQueryFromLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Push current query to the URL (replace to avoid noisy history).
  const search = useMemo(() => toSearchString(query), [query])
  useEffect(() => {
    const current = window.location.search
    if (current === search) return
    const nextUrl = `${window.location.pathname}${search}`
    window.history.replaceState(null, '', nextUrl)
  }, [search])

  const actions = useMemo(() => {
    return {
      setPartial(updater: (prev: TasksQueryState) => TasksQueryState) {
        setQuery(prev => updater(prev))
      },
      resetToFirstPage() {
        setQuery(prev => ({ ...prev, pageNumber: 1 }))
      },
      clearFilters() {
        setQuery(prev => ({
          ...DEFAULTS,
          // preserve pageSize to avoid surprising UI changes
          pageSize: prev.pageSize,
        }))
      },
    }
  }, [])

  return { query, setQuery, actions }
}

