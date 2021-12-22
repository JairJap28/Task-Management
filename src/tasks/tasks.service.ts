import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './DTO/create-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string, user?: User): Promise<Task> {
    const searchedTask = await this.tasksRepository.findOne({
      where: { id, user },
    });

    if (!searchedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return searchedTask;
  }

  async deleteTaskById(id: string, user: User) {
    const removedTasks = await this.tasksRepository.delete({ id, user });

    if (removedTasks.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
