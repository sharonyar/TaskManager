using System.ComponentModel.DataAnnotations;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.DTOs;

public class TaskQueryParameters
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    // Pagination
    public int PageNumber { get; set; } = 1;
    
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    // Filtering
    public TaskManager.Domain.Entities.TaskStatus? Status { get; set; }
    public TaskManager.Domain.Entities.TaskPriority? Priority { get; set; }
    public DateTime? DueDateFrom { get; set; }
    public DateTime? DueDateTo { get; set; }

    // Search
    public string? SearchTerm { get; set; }

    // Sorting
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortDirection { get; set; } = "desc";
}
