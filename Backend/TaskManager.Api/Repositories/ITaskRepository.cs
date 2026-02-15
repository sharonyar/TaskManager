using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories;

public interface ITaskRepository
{
    Task<IReadOnlyList<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
    Task<TaskItem?> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
