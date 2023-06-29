import { ApiProperty } from '@nestjs/swagger';

import { CreateNoteDto } from '../../notes/dto/note.dto';
import { User } from '../../users/user.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'Project Example', description: 'Name Project' })
  name: string;
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address Owner Project',
  })
  owner: User;
  collaborators: User[];
  notes: CreateNoteDto[];
}
