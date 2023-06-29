import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return user if exists', async () => {
      const payload = { username: 'test@example.com' };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user as any);

      const result = await strategy.validate(payload);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        payload.username,
      );
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const payload = { username: 'test@example.com' };
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        payload.username,
      );
    });
  });
});
