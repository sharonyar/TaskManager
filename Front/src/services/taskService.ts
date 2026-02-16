import type { PaginatedResponse, Task, TaskQueryParameters, TaskPriority, TaskStatus } from '../types/index.ts'

const DEFAULT_API_BASE = 'http://localhost:5003/api'
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE

type RequestOptions = {
  signal?: AbortSignal
}

type CreateTaskInput = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
}

type UpdateTaskInput = {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
}

function buildQueryString(params: TaskQueryParameters): string {
  const qs = new URLSearchParams()

  if (params.pageNumber && params.pageNumber !== 1) qs.set('pageNumber', String(params.pageNumber))
  if (params.pageSize && params.pageSize !== 10) qs.set('pageSize', String(params.pageSize))

  if (params.status) qs.set('status', params.status)
  if (params.priority) qs.set('priority', params.priority)
  if (params.searchTerm) qs.set('searchTerm', params.searchTerm)

  if (params.sortBy) qs.set('sortBy', params.sortBy)
  if (params.sortDirection) qs.set('sortDirection', params.sortDirection)

  const str = qs.toString()
  return str.length ? `?${str}` : ''
}

export const taskService = {
  async getTasks(
    queryParameters: TaskQueryParameters,
    options: RequestOptions = {},
  ): Promise<PaginatedResponse<Task>> {
    const response = await fetch(`${API_BASE}/tasks${buildQueryString(queryParameters)}`, {
      signal: options.signal,
    })

    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }

    return response.json()
  },

  async getAll(options: RequestOptions = {}): Promise<Task[]> {
    const result = await taskService.getTasks({ pageNumber: 1, pageSize: 100 }, options)
    return result.items
  },

  async getById(id: string): Promise<Task | null> {
    const response = await fetch(`${API_BASE}/tasks/${id}`)
    if (!response.ok) return null
    return response.json()
  },

  async create(task: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    if (!response.ok) throw new Error('Failed to create task')

    return response.json()
  },

  async update(id: string, task: UpdateTaskInput): Promise<Task | null> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    if (!response.ok) return null

    return response.json()
  },

  async delete(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    })

    return response.ok
  },
}
