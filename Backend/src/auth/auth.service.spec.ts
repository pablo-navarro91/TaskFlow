import { ConflictException, UnauthorizedException } from '@nestjs/common';import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
  signAsync: jest.fn(),
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
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
  
  describe('login', () => {
  it('should return an access token when credentials are valid', async () => {
    const plainPassword = 'TaskFlow123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = {
      id: 'user-id',
      name: 'Pablo',
      email: 'pablo@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersServiceMock.findByEmail.mockResolvedValue(user);
    jwtServiceMock.signAsync.mockResolvedValue('mock-access-token');

    const result = await authService.login({
      email: 'pablo@example.com',
      password: plainPassword,
    });

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
      'pablo@example.com',
    );

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });

    expect(result).toEqual({
      accessToken: 'mock-access-token',
    });
  });

  it('should normalize the email before searching for the user', async () => {
    const plainPassword = 'TaskFlow123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = {
      id: 'user-id',
      name: 'Pablo',
      email: 'pablo@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersServiceMock.findByEmail.mockResolvedValue(user);
    jwtServiceMock.signAsync.mockResolvedValue('mock-access-token');

    await authService.login({
      email: '  PABLO@EXAMPLE.COM  ',
      password: plainPassword,
    });

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
      'pablo@example.com',
    );
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'unknown@example.com',
        password: 'TaskFlow123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('TaskFlow123!', 12);

    usersServiceMock.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'Pablo',
      email: 'pablo@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      authService.login({
        email: 'pablo@example.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
  });
});
});