using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.DTOs;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }
[HttpGet]
public IActionResult Get()
{
    return Ok(new[]
    {
        new { id = "1", title = "Learn Cursor", isCompleted = false },
        new { id = "2", title = "Connect Frontend", isCompleted = false }
    });
}

    // [HttpGet]
    // public async Task<ActionResult<IReadOnlyList<TaskDto>>> GetAll(CancellationToken cancellationToken)
    // {
    //     var tasks = await _taskService.GetAllTasksAsync(cancellationToken);
    //     return Ok(tasks);
    // }

    // [HttpGet("{id:guid}")]
    // public async Task<ActionResult<TaskDto>> GetById(Guid id, CancellationToken cancellationToken)
    // {
    //     var task = await _taskService.GetTaskByIdAsync(id, cancellationToken);
    //     if (task is null)
    //         return NotFound();
    //     return Ok(task);
    // }

    // [HttpPost]
    // public async Task<ActionResult<TaskDto>> Create([FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    // {
    //     var task = await _taskService.CreateTaskAsync(request, cancellationToken);
    //     return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    // }

    // [HttpPut("{id:guid}")]
    // public async Task<ActionResult<TaskDto>> Update(Guid id, [FromBody] UpdateTaskRequest request, CancellationToken cancellationToken)
    // {
    //     var task = await _taskService.UpdateTaskAsync(id, request, cancellationToken);
    //     if (task is null)
    //         return NotFound();
    //     return Ok(task);
    // }

    // [HttpDelete("{id:guid}")]
    // public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    // {
    //     var deleted = await _taskService.DeleteTaskAsync(id, cancellationToken);
    //     if (!deleted)
    //         return NotFound();
    //     return NoContent();
    // }
}
