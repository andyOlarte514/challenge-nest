import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: this.relations,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async createUser(user: UserDto): Promise<User> {
    const isExistsUser = await this.usersRepository.findOne({
      where: { email: user.email },
      relations: this.relations,
    });

    if (isExistsUser) {
      throw new ConflictException('user already exists');
    }

    return this.usersRepository.save(user);
  }

  async updateUser(email: string, data: Partial<User>): Promise<User> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.usersRepository.update(email, data);

    return this.usersRepository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  async deleteUser(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.usersRepository.delete(email);
  }
}
