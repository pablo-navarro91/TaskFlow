import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      usersServiceMock.create.mockImplementation(
        async (name: string, email: string, password: string) => ({
          id: 'user-id',
          name,
          email,
          password,
          createdAt: new Date('2026-09-09T12:00:00Z'),
          updatedAt: new Date('2026-09-09T12:00:00Z'),
        }),
      );

      const result = await authService.register({
        name: 'Pablo',
        email: 'pablo@example.com',
        password: 'TaskFlow123!',
      });

      expect(result).toEqual({
        id: 'user-id',
        name: 'Pablo',
        email: 'pablo@example.com',
        createdAt: new Date('2026-09-09T12:00:00Z'),
      });

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
        'pablo@example.com',
      );

      expect(usersServiceMock.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when email already exists', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 'existing-user-id',
        email: 'pablo@example.com',
      });

      await expect(
        authService.register({
          name: 'Pablo',
          email: 'pablo@example.com',
          password: 'TaskFlow123!',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(usersServiceMock.create).not.toHaveBeenCalled();
    });
  });
});