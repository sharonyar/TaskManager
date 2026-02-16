using TaskManager.Domain.Entities;
using DomainTask = TaskManager.Domain.Entities.Task;

namespace TaskManager.Domain.Repositories;

public interface ITaskRepository
{
    System.Threading.Tasks.Task<(IReadOnlyList<DomainTask> Items, int TotalCount)> GetTasksAsync(
        Entities.TaskStatus? status,
        Entities.TaskPriority? priority,
        DateTime? dueDateFrom,
        DateTime? dueDateTo,
        string? searchTerm,
        string? sortBy,
        string? sortDirection,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task<DomainTask?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task<DomainTask> AddAsync(DomainTask task, CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task<DomainTask?> UpdateAsync(DomainTask task, CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
