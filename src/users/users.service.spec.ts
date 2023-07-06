import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [new User(), new User()];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await usersService.getAllUsers();

      expect(result).toEqual(users);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.getUserByEmail(email);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: usersService.relations,
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = new User();
      user.email = 'test@example.com';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await usersService.createUser(user);

      expect(result).toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw a ConflictException if user already exists', async () => {
      const user = new User();
      user.email = 'test@example.com';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);

      await expect(usersService.createUser(user)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const email = 'test@example.com';
      const updatedUser = new User();
      jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(updatedUser);

      const result = await usersService.updateUser(email, {});

      expect(result).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(email, {});
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: usersService.relations,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.email = email;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      await usersService.deleteUser(email);

      expect(userRepository.delete).toHaveBeenCalledWith(email);
    });
  });
});
