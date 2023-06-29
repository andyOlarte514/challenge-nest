import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UsersRepository,
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

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return an object with token when valid credentials are provided', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const token = 'token123';

      jest.spyOn(userRepository, 'findOne');
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      jest.spyOn(authService, 'signIn').mockResolvedValue(token);

      const result = await authController.signIn(loginDto);

      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ token });
    });
  });
});
