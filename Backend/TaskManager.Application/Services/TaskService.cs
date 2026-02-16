using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Repositories;
using DomainTask = TaskManager.Domain.Entities.Task;

namespace TaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<PaginatedResponse<TaskDto>> GetTasksAsync(TaskQueryParameters queryParameters, CancellationToken cancellationToken = default)
    {
        var (tasks, totalCount) = await _taskRepository.GetTasksAsync(
            queryParameters.Status,
            queryParameters.Priority,
            queryParameters.DueDateFrom,
            queryParameters.DueDateTo,
            queryParameters.SearchTerm,
            queryParameters.SortBy,
            queryParameters.SortDirection,
            queryParameters.PageNumber,
            queryParameters.PageSize,
            cancellationToken);

        var taskDtos = tasks.Select(ToDto).ToList();

        return new PaginatedResponse<TaskDto>
        {
            Items = taskDtos,
            TotalCount = totalCount,
            PageNumber = queryParameters.PageNumber,
            PageSize = queryParameters.PageSize
        };
    }

    public async Task<TaskDto?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken);
        return task is null ? null : ToDto(task);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var task = new DomainTask
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Status = request.Status ?? TaskManager.Domain.Entities.TaskStatus.Todo,
            Priority = request.Priority ?? TaskManager.Domain.Entities.TaskPriority.Medium,
            DueDate = request.DueDate,
            CreatedAt = DateTime.UtcNow
        };
        var added = await _taskRepository.AddAsync(task, cancellationToken);
        return ToDto(added);
    }

    public async Task<TaskDto?> UpdateTaskAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await _taskRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
            return null;

        var updated = new DomainTask
        {
            Id = existing.Id,
            CreatedAt = existing.CreatedAt,
            Title = request.Title,
            Description = request.Description,
            Status = request.Status,
            Priority = request.Priority,
            DueDate = request.DueDate
        };
        var result = await _taskRepository.UpdateAsync(updated, cancellationToken);
        return result is null ? null : ToDto(result);
    }

    public Task<bool> DeleteTaskAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _taskRepository.DeleteAsync(id, cancellationToken);
    }

    private static TaskDto ToDto(DomainTask task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            Priority = task.Priority.ToString(),
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt
        };
    }
}
