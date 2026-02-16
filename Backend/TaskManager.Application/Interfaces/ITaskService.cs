using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface ITaskService
{
    Task<PaginatedResponse<TaskDto>> GetTasksAsync(TaskQueryParameters queryParameters, CancellationToken cancellationToken = default);
    Task<TaskDto?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<TaskDto?> UpdateTaskAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteTaskAsync(Guid id, CancellationToken cancellationToken = default);
}
