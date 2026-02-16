# DDD Layer Refactoring Plan

## Current Structure Analysis

**Single Project:** `TaskManager.Api`
- Models: Task, TaskStatus, TaskPriority
- Repositories: ITaskRepository (interface), TaskRepository (implementation)
- Services: ITaskService (interface), TaskService (implementation)
- DTOs: TaskDto, CreateTaskRequest, UpdateTaskRequest
- Controllers: TasksController
- Program.cs: DI registration

## Target DDD Structure

```
Backend/
├── TaskManager.Domain/          # Domain Layer
│   ├── Entities/Task.cs
│   ├── Enums/TaskStatus.cs, TaskPriority.cs
│   └── Repositories/ITaskRepository.cs
│
├── TaskManager.Application/     # Application Layer
│   ├── DTOs/ (TaskDto, CreateTaskRequest, UpdateTaskRequest)
│   ├── Interfaces/ITaskService.cs
│   └── Services/TaskService.cs
│
├── TaskManager.Infrastructure/  # Infrastructure Layer
│   └── Repositories/TaskRepository.cs
│
└── TaskManager.Api/             # Presentation Layer
    ├── Controllers/TasksController.cs
    └── Program.cs
```

## Implementation Steps

1. Create Domain layer project (class library)
2. Create Application layer project (class library, references Domain)
3. Create Infrastructure layer project (class library, references Domain)
4. Move code to appropriate layers
5. Update API project references
6. Update namespaces throughout
7. Update Program.cs DI registration
