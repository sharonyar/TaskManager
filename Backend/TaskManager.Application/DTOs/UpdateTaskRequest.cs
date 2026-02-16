using System.ComponentModel.DataAnnotations;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.DTOs;

public class UpdateTaskRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public TaskManager.Domain.Entities.TaskStatus Status { get; set; }
    public TaskManager.Domain.Entities.TaskPriority Priority { get; set; }
    
    public DateTime? DueDate { get; set; }
}
