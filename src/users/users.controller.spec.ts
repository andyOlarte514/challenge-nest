import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

const MOCK_USER = {
  email: 'test@example.com',
  name: 'test example',
  password: 'examplepass',
  ownedProjects: [],
  collaboratedProjects: [],
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UsersRepository,
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: User[] = [MOCK_USER as User];
      jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(users);
      const result = await usersController.getAllUsers();
      expect(result).toBe(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: User = MOCK_USER as User;
      const createdUser: User = MOCK_USER as User;
      jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser);
      const result = await usersController.createUser(user);
      expect(result).toBe(createdUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return the user with the specified email', async () => {
      const email = 'test@example.com';
      const user: User = MOCK_USER as User;
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
      const result = await usersController.getUserByEmail(email);
      expect(result).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should update the user with the specified email', async () => {
      const email = 'test@example.com';
      const updatedUser: User = MOCK_USER as User;
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);
      const result = await usersController.updateUser(email, updatedUser);
      expect(result).toBe(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with the specified email', async () => {
      const email = 'test@example.com';
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue();
      const result = await usersController.deleteUser(email);
      expect(result).toBeUndefined();
    });
  });
});
