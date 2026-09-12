import {
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthGuard } from './jwt-guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const jwtServiceMock = {
    verifyAsync: jest.fn(),
  };

  const configServiceMock = {
    getOrThrow: jest.fn(),
  };

  const createExecutionContext = (
    authorization?: string,
  ): ExecutionContext => {
    const request = {
      headers: {
        authorization,
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new JwtAuthGuard(
      jwtServiceMock as unknown as JwtService,
      configServiceMock as unknown as ConfigService,
    );

    configServiceMock.getOrThrow.mockReturnValue(
      'taskflow_dev_secret',
    );
  });

  it('should allow access when the token is valid', async () => {
    const payload = {
      sub: 'user-id',
      email: 'pablo@example.com',
    };

    jwtServiceMock.verifyAsync.mockResolvedValue(payload);

    const context = createExecutionContext(
      'Bearer valid-token',
    );

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(
      'valid-token',
      {
        secret: 'taskflow_dev_secret',
      },
    );
  });

  it('should reject a request without a token', async () => {
    const context = createExecutionContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid token', async () => {
    jwtServiceMock.verifyAsync.mockRejectedValue(
      new Error('invalid signature'),
    );

    const context = createExecutionContext(
      'Bearer invalid-token',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should reject an expired token', async () => {
    jwtServiceMock.verifyAsync.mockRejectedValue(
      new Error('jwt expired'),
    );

    const context = createExecutionContext(
      'Bearer expired-token',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});