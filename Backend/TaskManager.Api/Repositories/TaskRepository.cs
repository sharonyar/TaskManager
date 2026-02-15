using System.Collections.Concurrent;
using TaskManager.Api.Models;

namespace TaskManager.Api.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly ConcurrentDictionary<Guid, TaskItem> _store = new();

    public Task<IReadOnlyList<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var list = _store.Values.ToList() as IReadOnlyList<TaskItem>;
        return Task.FromResult(list!);
    }

    public Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _store.TryGetValue(id, out var item);
        return Task.FromResult(item);
    }

    public Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _store[taskItem.Id] = taskItem;
        return Task.FromResult(taskItem);
    }

    public Task<TaskItem?> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (!_store.ContainsKey(taskItem.Id))
            return Task.FromResult<TaskItem?>(null);
        _store[taskItem.Id] = taskItem;
        return Task.FromResult<TaskItem?>(taskItem);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var removed = _store.TryRemove(id, out _);
        return Task.FromResult(removed);
    }
}
