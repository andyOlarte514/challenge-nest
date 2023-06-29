import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/project.entity';

export class CreateNoteDto {
  @ApiProperty({ example: 'example title', description: 'Note Title' })
  title: string;
  @ApiProperty({ example: 'example content', description: 'Note Content' })
  content: string;
  @ApiProperty({
    example: '1',
    description: 'Project ID where the note is being created',
  })
  project: Project;
}
