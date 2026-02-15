export interface Task {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  dueDate?: string
  createdAt: string
}
