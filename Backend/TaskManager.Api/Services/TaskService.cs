using TaskManager.Api.DTOs;
using TaskManager.Api.Models;
using TaskManager.Api.Repositories;

namespace TaskManager.Api.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IReadOnlyList<TaskDto>> GetAllTasksAsync(CancellationToken cancellationToken = default)
    {
        var items = await _taskRepository.GetAllAsync(cancellationToken);
        return items.Select(ToDto).ToList();
    }

    public async Task<TaskDto?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _taskRepository.GetByIdAsync(id, cancellationToken);
        return item is null ? null : ToDto(item);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var item = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };
        var added = await _taskRepository.AddAsync(item, cancellationToken);
        return ToDto(added);
    }

    public async Task<TaskDto?> UpdateTaskAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await _taskRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
            return null;

        var updated = new TaskItem
        {
            Id = existing.Id,
            CreatedAt = existing.CreatedAt,
            Title = request.Title,
            Description = request.Description,
            IsCompleted = request.IsCompleted,
            DueDate = request.DueDate
        };
        var result = await _taskRepository.UpdateAsync(updated, cancellationToken);
        return result is null ? null : ToDto(result);
    }

    public Task<bool> DeleteTaskAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _taskRepository.DeleteAsync(id, cancellationToken);
    }

    private static TaskDto ToDto(TaskItem item)
    {
        return new TaskDto
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            IsCompleted = item.IsCompleted,
            DueDate = item.DueDate,
            CreatedAt = item.CreatedAt
        };
    }
}
