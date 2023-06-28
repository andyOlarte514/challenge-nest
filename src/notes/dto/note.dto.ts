import { Project } from 'src/projects/project.entity';

export class CreateNoteDto {
  title: string;
  content: string;
  project: Project;
}
