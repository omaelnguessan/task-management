import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  /**
   * get all tasks
   *
   * @param filterDto GetTasksFilterDto
   * @returns Promise<Task[]>
   */
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  /**
   * create task
   *
   * @param createTaskDto CreateTaskDto
   * @returns task Promise<Task>
   */
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  /**
   * get task by id
   *
   * @param id String
   * @returns task Promise<Task>
   */
  getTaskById(id: string): Promise<Task> {
    return this.tasksRepository.getTaskById(id);
  }

  /**
   * delete task
   *
   * @param id string
   * @returns void
   */
  async deleteTask(id: string): Promise<void> {
    const deleteResult = await this.tasksRepository.deleteTask(id);
    if (deleteResult.affected === 0)
      throw new NotFoundException(`Task id "${id}" not found`);
  }

  /**
   * update task status
   *
   * @param id string
   * @param status TaskStatus
   * @returns task Promise<Task>
   */
  updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, status);
  }
}
