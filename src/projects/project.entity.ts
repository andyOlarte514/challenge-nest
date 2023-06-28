import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Note } from 'src/notes/note.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.ownedProjects)
  owner: User;

  @ManyToMany(() => User, (user) => user.collaboratedProjects)
  @JoinTable()
  collaborators: User[];

  @OneToMany(() => Note, (note) => note.project)
  notes: Note[];
}
