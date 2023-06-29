import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  relations = ['ownedProjects', 'collaboratedProjects'];

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ relations: this.relations });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  async createUser(user: UserDto): Promise<User> {
    const isExistsUser = await this.getUserByEmail(user.email);
    if (!!isExistsUser) {
      throw new ConflictException('user already exists');
    }
    return this.usersRepository.save(user);
  }

  async updateUser(email: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(email, data);
    return this.usersRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  async deleteUser(email: string): Promise<void> {
    await this.usersRepository.delete(email);
  }
}
