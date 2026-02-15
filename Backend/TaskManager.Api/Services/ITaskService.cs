using TaskManager.Api.DTOs;

namespace TaskManager.Api.Services;

public interface ITaskService
{
    Task<IReadOnlyList<TaskDto>> GetAllTasksAsync(CancellationToken cancellationToken = default);
    Task<TaskDto?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskDto> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<TaskDto?> UpdateTaskAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteTaskAsync(Guid id, CancellationToken cancellationToken = default);
}
