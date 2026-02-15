import type { Task } from '../types/index'

const API_BASE = 'http://localhost:5003/api'

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`)

    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }

    return response.json()
  },

  async getById(id: string): Promise<Task | null> {
    const response = await fetch(`${API_BASE}/tasks/${id}`)
    if (!response.ok) return null
    return response.json()
  },

  async create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    if (!response.ok) throw new Error('Failed to create task')

    return response.json()
  },

  async update(id: string, task: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
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
