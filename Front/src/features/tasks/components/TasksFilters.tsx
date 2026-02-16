import type { TaskPriority, TaskStatus } from '../../../types/index.ts'

type TasksFiltersProps = {
  status?: TaskStatus
  priority?: TaskPriority
  searchText: string
  pageSize: number
  onStatusChange(next?: TaskStatus): void
  onPriorityChange(next?: TaskPriority): void
  onSearchTextChange(next: string): void
  onPageSizeChange(next: number): void
  onClear(): void
}

function TasksFilters({
  status,
  priority,
  searchText,
  pageSize,
  onStatusChange,
  onPriorityChange,
  onSearchTextChange,
  onPageSizeChange,
  onClear,
}: TasksFiltersProps) {
  return (
    <form
      onSubmit={e => e.preventDefault()}
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end', marginBottom: 12 }}
    >
      <label style={{ display: 'grid', gap: 4 }}>
        <span>Status</span>
        <select value={status ?? ''} onChange={e => onStatusChange((e.target.value || undefined) as TaskStatus | undefined)}>
          <option value="">All</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </label>

      <label style={{ display: 'grid', gap: 4 }}>
        <span>Priority</span>
        <select
          value={priority ?? ''}
          onChange={e => onPriorityChange((e.target.value || undefined) as TaskPriority | undefined)}
        >
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <label style={{ display: 'grid', gap: 4, minWidth: 220 }}>
        <span>Search</span>
        <input
          value={searchText}
          onChange={e => onSearchTextChange(e.target.value)}
          placeholder="Title or description..."
        />
      </label>

      <label style={{ display: 'grid', gap: 4 }}>
        <span>Page size</span>
        <select value={String(pageSize)} onChange={e => onPageSizeChange(Number(e.target.value))}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>

      <button type="button" onClick={onClear}>
        Clear
      </button>
    </form>
  )
}

export default TasksFilters

