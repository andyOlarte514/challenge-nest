import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll() {
    return this.notesService.findAll();
  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.notesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.notesService.remove(id);
  }
}