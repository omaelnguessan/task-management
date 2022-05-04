import { NotFoundException } from '@nestjs/common/exceptions';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  /**
   * get Tasks
   *
   * @param filterDto GetTasksFilterDto
   * @returns
   */
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) query.where('task.status = :status', { status });

    if (search)
      query.where(
        'LOWER(task.title) like LOWER(:search) OR LOWER(task.description) like LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );

    const tasks = await query.getMany();
    return tasks;
  }

  /**
   * create task
   *
   * @param createTaskDto CreateTaskDto
   * @returns task Promise<Task>
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  /**
   * get task by id
   *
   * @param id String
   * @returns task Promise<Task>
   */
  async getTaskById(id: string): Promise<Task> {
    const task: Task = await this.findOne(id);
    if (!task) throw new NotFoundException(`Task id ${id} not found`);
    return task;
  }

  /**
   * delete task
   *
   * @param id string
   * @returns void
   */
  async deleteTask(id: string): Promise<DeleteResult> {
    const task = await this.delete(id);
    return task;
  }

  /**
   * update task status
   *
   * @param id string
   * @param status TaskStatus
   * @returns task Task
   */
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    this.save(task);
    return task;
  }
}
