using System.Collections.Concurrent;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Repositories;
using DomainTask = TaskManager.Domain.Entities.Task;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly ConcurrentDictionary<Guid, DomainTask> _store = new();

    public System.Threading.Tasks.Task<(IReadOnlyList<DomainTask> Items, int TotalCount)> GetTasksAsync(
        TaskManager.Domain.Entities.TaskStatus? status,
        TaskManager.Domain.Entities.TaskPriority? priority,
        DateTime? dueDateFrom,
        DateTime? dueDateTo,
        string? searchTerm,
        string? sortBy,
        string? sortDirection,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var query = _store.Values.AsQueryable();

        // Filtering
        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        if (dueDateFrom.HasValue)
        {
            query = query.Where(t => t.DueDate.HasValue && t.DueDate >= dueDateFrom.Value);
        }

        if (dueDateTo.HasValue)
        {
            query = query.Where(t => t.DueDate.HasValue && t.DueDate <= dueDateTo.Value);
        }

        // Search
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var searchLower = searchTerm.ToLowerInvariant();
            query = query.Where(t =>
                t.Title.ToLowerInvariant().Contains(searchLower) ||
                (!string.IsNullOrEmpty(t.Description) && t.Description.ToLowerInvariant().Contains(searchLower)));
        }

        // Get total count before pagination
        var totalCount = query.Count();

        // Sorting
        query = ApplySorting(query, sortBy, sortDirection);

        // Pagination
        var items = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList()
            .AsReadOnly();

        return System.Threading.Tasks.Task.FromResult<(IReadOnlyList<DomainTask>, int)>((items, totalCount));
    }

    private static IQueryable<DomainTask> ApplySorting(
        IQueryable<DomainTask> query,
        string? sortBy,
        string? sortDirection)
    {
        sortBy = sortBy?.ToLowerInvariant() ?? "createdat";
        var isDescending = sortDirection?.ToLowerInvariant() == "desc";

        query = sortBy switch
        {
            "createdat" => isDescending
                ? query.OrderByDescending(t => t.CreatedAt)
                : query.OrderBy(t => t.CreatedAt),
            "duedate" => isDescending
                ? query.OrderByDescending(t => t.DueDate ?? DateTime.MaxValue)
                : query.OrderBy(t => t.DueDate ?? DateTime.MaxValue),
            "priority" => isDescending
                ? query.OrderByDescending(t => t.Priority)
                : query.OrderBy(t => t.Priority),
            _ => query.OrderByDescending(t => t.CreatedAt)
        };

        return query;
    }

    public System.Threading.Tasks.Task<DomainTask?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _store.TryGetValue(id, out var task);
        return System.Threading.Tasks.Task.FromResult(task);
    }

    public System.Threading.Tasks.Task<DomainTask> AddAsync(DomainTask task, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _store[task.Id] = task;
        return System.Threading.Tasks.Task.FromResult(task);
    }

    public System.Threading.Tasks.Task<DomainTask?> UpdateAsync(DomainTask task, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (!_store.ContainsKey(task.Id))
            return System.Threading.Tasks.Task.FromResult<DomainTask?>(null);
        _store[task.Id] = task;
        return System.Threading.Tasks.Task.FromResult<DomainTask?>(task);
    }

    public System.Threading.Tasks.Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var removed = _store.TryRemove(id, out _);
        return System.Threading.Tasks.Task.FromResult(removed);
    }
}
