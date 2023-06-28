import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(@Body() user: User) {
    return this.usersService.createUser(user);
  }

  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Put(':email')
  updateUser(@Param('email') email: string, @Body() data: Partial<User>) {
    return this.usersService.updateUser(email, data);
  }

  @Delete(':email')
  deleteUser(@Param('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}
