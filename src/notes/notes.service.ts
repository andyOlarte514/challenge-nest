import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return this.noteRepository.save(note);
  }

  async getAllNotes(): Promise<Note[]> {
    return this.noteRepository.find({ relations: ['project'] });
  }

  async getNoteById(id: number): Promise<Note> {
    const note = this.noteRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async update(id: number, data: CreateNoteDto): Promise<Note> {
    const note = await this.getNoteById(id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.update(id, data);

    return this.noteRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async remove(id: number): Promise<void> {
    const note = await this.getNoteById(id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.delete(id);
  }

  async getAllByProject(projectId: string): Promise<Note[]> {
    return this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.project', 'project')
      .where('project.id = :projectId', { projectId })
      .getMany();
  }
}
