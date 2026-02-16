import { useEffect, useMemo, useState } from 'react'
import { taskService } from '../../services/index.ts'
import type { PaginatedResponse, SortDirection, Task, TaskSortBy, TaskStatus, TaskPriority } from '../../types/index.ts'
import PaginationControls from './components/PaginationControls.tsx'
import TasksFilters from './components/TasksFilters.tsx'
import TasksTable from './components/TasksTable.tsx'
import { useTasksQueryState } from './hooks/useTasksQueryState.ts'

function TasksPage() {
  const { query, setQuery, actions } = useTasksQueryState()

  const [data, setData] = useState<PaginatedResponse<Task> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search for the network request (but keep URL/state updated immediately).
  const debouncedSearchTerm = useDebouncedValue(query.searchTerm ?? '', 300).trim() || undefined
  const fetchQuery = useMemo(() => ({ ...query, searchTerm: debouncedSearchTerm }), [query, debouncedSearchTerm])

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => {
      setLoading(true)
      setError(null)
    })

    taskService
      .getTasks(fetchQuery, { signal: controller.signal })
      .then(result => {
        setData(result)

        // If the user is on a page that no longer exists (after filtering), clamp to last page.
        if (result.totalPages > 0 && fetchQuery.pageNumber > result.totalPages) {
          setQuery(prev => ({ ...prev, pageNumber: result.totalPages }))
        }
      })
      .catch(err => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => {
        if (controller.signal.aborted) return
        setLoading(false)
      })

    return () => controller.abort()
  }, [fetchQuery, setQuery])

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 0
  const hasPrevious = data?.hasPrevious ?? false
  const hasNext = data?.hasNext ?? false

  return (
    <section>
      <h2>Tasks</h2>

      <TasksFilters
        status={query.status as TaskStatus | undefined}
        priority={query.priority as TaskPriority | undefined}
        searchText={query.searchTerm ?? ''}
        pageSize={query.pageSize}
        onStatusChange={next => setQuery(prev => ({ ...prev, status: next, pageNumber: 1 }))}
        onPriorityChange={next => setQuery(prev => ({ ...prev, priority: next, pageNumber: 1 }))}
        onSearchTextChange={next => setQuery(prev => ({ ...prev, searchTerm: next || undefined, pageNumber: 1 }))}
        onPageSizeChange={next => setQuery(prev => ({ ...prev, pageSize: next, pageNumber: 1 }))}
        onClear={() => {
          actions.clearFilters()
        }}
      />

      {loading ? <p>Loading…</p> : null}
      {error ? <p>Error: {error}</p> : null}
      {!loading && !error && items.length === 0 ? <p>No tasks found</p> : null}

      {items.length > 0 ? (
        <>
          <p style={{ opacity: 0.8 }}>
            Total: {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
          </p>

          <TasksTable
            items={items}
            sortBy={query.sortBy}
            sortDirection={query.sortDirection}
            onSort={nextSortBy => {
              setQuery(prev => {
                const same = prev.sortBy === nextSortBy
                const nextDirection: SortDirection = same ? (prev.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc'
                return { ...prev, sortBy: nextSortBy as TaskSortBy, sortDirection: nextDirection, pageNumber: 1 }
              })
            }}
          />

          <PaginationControls
            pageNumber={query.pageNumber}
            totalPages={totalPages}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={() => setQuery(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }))}
            onNext={() => setQuery(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
          />
        </>
      ) : null}
    </section>
  )
}

export default TasksPage

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
