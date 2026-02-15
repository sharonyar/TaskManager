import { useEffect, useState } from 'react'
import { taskService } from '../../services'
import type { Task } from '../../types/task.ts'

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    taskService
      .getAll()
      .then(data => setTasks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <section>
      <h2>Tasks</h2>

      {tasks.length === 0 && <p>No tasks found</p>}

      {tasks.map(task => (
        <div key={task.id}>
          {task.title}
        </div>
      ))}
    </section>
  )
}

export default TasksPage
