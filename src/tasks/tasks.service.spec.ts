import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser: User = {
  username: 'testUser',
  id: 'testUser-123',
  password: 'tests',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // Initialize a NestJS module with tasksService and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('Some value');

      const result = await tasksService.getTasks(null, mockUser);

      expect(result).toEqual('Some value');
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask: Task = {
        title: 'Test Title',
        description: 'Test Description',
        id: 'anyId',
        status: TaskStatus.OPEN,
        user: mockUser,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('anyId', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles the error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('anyId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
