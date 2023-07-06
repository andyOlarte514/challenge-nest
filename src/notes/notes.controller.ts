import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notes')
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes() {
    return this.notesService.getAllNotes();
  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get(':id')
  async getNoteById(@Param('id') id: number) {
    return this.notesService.getNoteById(id);
  }

  @Put(':id')
  async updateNote(@Param('id') id: number, @Body() data: CreateNoteDto) {
    return this.notesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.notesService.remove(id);
  }

  @Get('/by-project/:projectId')
  async getAllByProject(@Param('projectId') projectId: string) {
    return this.notesService.getAllByProject(projectId);
  }
}
