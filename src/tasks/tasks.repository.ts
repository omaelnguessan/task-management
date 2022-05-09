import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { User } from '../auth/user.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  /**
   * get Tasks
   *
   * @param filterDto GetTasksFilterDto
   * @returns
   */
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.user = :user', { user: user.id });

    if (status) query.where('task.status = :status', { status });

    if (search)
      query.where(
        '(LOWER(task.title) like LOWER(:search) OR LOWER(task.description) like LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filter: ${filterDto}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  /**
   * create task
   *
   * @param createTaskDto CreateTaskDto
   * @returns task Promise<Task>
   */
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user,
    });

    await this.save(task);

    return task;
  }

  /**
   * get task by id
   *
   * @param id string
   * @param user User
   * @returns task Promise<Task>
   */
  async getTaskById(id: string, user: User): Promise<Task> {
    const task: Task = await this.findOne({ where: { id, user } });
    if (!task) throw new NotFoundException(`Task id ${id} not found`);
    return task;
  }

  /**
   * delete task
   *
   * @param id string
   * @param user User
   * @returns void
   */
  async deleteTask(id: string, user: User): Promise<DeleteResult> {
    const task = await this.delete({ id, user });
    return task;
  }

  /**
   * update task status
   *
   * @param id string
   * @param status TaskStatus
   * @returns task Task
   */
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    this.save(task);
    return task;
  }
}
