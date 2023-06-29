import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;
  @ApiProperty({ example: 'Jhon Example', description: 'Name' })
  name: string;
  @ApiProperty({ example: 'password123', description: 'Password' })
  password: string;
}
