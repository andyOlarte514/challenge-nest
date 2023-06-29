import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../auth/dto/login.dto';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return a token when valid credentials are provided', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = {
        email: 'test@example.com',
        password: 'password123',
      } as User;
      const token = 'token123';

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.signIn(loginDto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({ username: user.email });
      expect(result).toBe(token);
    });

    it('should throw an UnauthorizedException when invalid credentials are provided', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'invalidpassword',
      };
      const user = {
        email: 'test@example.com',
        password: 'password123',
      } as User;

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);

      await expect(authService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });
});
