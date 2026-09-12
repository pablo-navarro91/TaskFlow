import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user when email exists', async () => {
      const user = {
        id: 'user-id',
        name: 'Pablo',
        email: 'pablo@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersRepositoryMock.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('pablo@example.com');

      expect(result).toEqual(user);

      expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          email: 'pablo@example.com',
        },
      });
    });

    it('should return null when email does not exist', async () => {
      usersRepositoryMock.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@example.com');

      expect(result).toBeNull();

      expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          email: 'unknown@example.com',
        },
      });
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const user = {
        id: 'user-id',
        name: 'Pablo',
        email: 'pablo@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersRepositoryMock.create.mockReturnValue(user);
      usersRepositoryMock.save.mockResolvedValue(user);

      const result = await service.create(
        'Pablo',
        'pablo@example.com',
        'hashed-password',
      );

      expect(usersRepositoryMock.create).toHaveBeenCalledWith({
        name: 'Pablo',
        email: 'pablo@example.com',
        password: 'hashed-password',
      });

      expect(usersRepositoryMock.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});