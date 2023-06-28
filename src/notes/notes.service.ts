import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Note[]> {
    return this.noteRepository.find({ relations: ['project'] });
  }

  async findOne(id: number): Promise<Note> {
    return this.noteRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.noteRepository.delete(id);
  }
}
