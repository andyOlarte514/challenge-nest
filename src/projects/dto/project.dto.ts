import { CreateNoteDto } from 'src/notes/dto/note.dto';
import { User } from 'src/users/user.entity';

export class CreateProjectDto {
  name: string;
  owner: User;
  collaborators: User[];
  notes: CreateNoteDto[];
}
