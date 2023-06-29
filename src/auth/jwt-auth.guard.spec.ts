import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call super.canActivate', () => {
      const context: ExecutionContext = {} as any;
      const canActivateSpy = jest
        .spyOn(guard, 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(canActivateSpy).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });
  });

  describe('handleRequest', () => {
    it('should throw UnauthorizedException if error or user is missing', () => {
      const err = new Error('Some error');
      const user = null;
      const handleRequestFn = jest.spyOn(guard, 'handleRequest');
      expect(() => guard.handleRequest(err, user)).toThrow(Error);
      expect(() => guard.handleRequest(err, user)).toThrow('Some error');
      expect(handleRequestFn).toHaveBeenCalledWith(err, user);
    });

    it('should return the user if no error and user is present', () => {
      const err = null;
      const user = { id: 1, username: 'test' };
      const handleRequestFn = jest.spyOn(guard, 'handleRequest');
      const result = guard.handleRequest(err, user);
      expect(result).toBe(user);
      expect(handleRequestFn).toHaveBeenCalledWith(err, user);
    });
  });
});
