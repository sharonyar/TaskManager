import type { SortDirection, Task, TaskSortBy } from '../../../types/index.ts'

type TasksTableProps = {
  items: Task[]
  sortBy: TaskSortBy
  sortDirection: SortDirection
  onSort(nextSortBy: TaskSortBy): void
}

function sortLabel(sortBy: TaskSortBy, activeSortBy: TaskSortBy, direction: SortDirection) {
  if (sortBy !== activeSortBy) return ''
  return direction === 'asc' ? ' ▲' : ' ▼'
}

function TasksTable({ items, sortBy, sortDirection, onSort }: TasksTableProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Title</th>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Status</th>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
            <button type="button" onClick={() => onSort('Priority')} style={{ font: 'inherit' }}>
              Priority{sortLabel('Priority', sortBy, sortDirection)}
            </button>
          </th>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
            <button type="button" onClick={() => onSort('DueDate')} style={{ font: 'inherit' }}>
              Due date{sortLabel('DueDate', sortBy, sortDirection)}
            </button>
          </th>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>
            <button type="button" onClick={() => onSort('CreatedAt')} style={{ font: 'inherit' }}>
              Created{sortLabel('CreatedAt', sortBy, sortDirection)}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(task => (
          <tr key={task.id}>
            <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>
              <div style={{ fontWeight: 600 }}>{task.title}</div>
              {task.description ? <div style={{ opacity: 0.8 }}>{task.description}</div> : null}
            </td>
            <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{task.status}</td>
            <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{task.priority}</td>
            <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{task.dueDate ? task.dueDate : '—'}</td>
            <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{task.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TasksTable

