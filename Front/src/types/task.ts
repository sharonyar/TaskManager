export type TaskStatus = 'Todo' | 'InProgress' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export type TaskSortBy = 'CreatedAt' | 'DueDate' | 'Priority'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  createdAt: string
}
