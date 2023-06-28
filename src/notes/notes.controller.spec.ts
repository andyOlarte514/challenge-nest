import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/note.dto';
import { Note } from './note.entity';
import { NotesRepository } from './notes.repository';

describe('NotesController', () => {
  let notesController: NotesController;
  let notesService: NotesService;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
        NotesRepository,
      ],
    }).compile();

    notesController = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  describe('findAll', () => {
    it('should return all notes', async () => {
      const notes: Note[] = [
        { id: 1, content: 'Note 1', project: {} as any },
      ] as Note[];
      jest.spyOn(notesService, 'findAll').mockResolvedValue(notes);
      const result = await notesController.findAll();
      expect(notesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(notes);
    });
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto = {
        title: 'title test',
        content: 'Test note',
      } as CreateNoteDto;
      const createdNote: Note = {
        id: 1,
        content: 'Test note',
        project: {} as any,
      } as Note;
      jest.spyOn(noteRepository, 'create');
      jest.spyOn(notesService, 'create').mockResolvedValue(createdNote);
      const result = await notesController.create(createNoteDto);
      expect(notesService.create).toHaveBeenCalledWith(createNoteDto);
      expect(result).toEqual(createdNote);
    });
  });

  describe('findOne', () => {
    it('should return a note by ID', async () => {
      const noteId = 1;
      const note: Note = {
        id: noteId,
        content: 'Note 1',
        project: {} as any,
      } as Note;
      jest.spyOn(notesService, 'findOne').mockResolvedValue(note);
      const result = await notesController.findOne(noteId);
      expect(notesService.findOne).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(note);
    });
  });

  describe('remove', () => {
    it('should remove a note by ID', async () => {
      const noteId = 1;
      jest.spyOn(notesService, 'remove').mockResolvedValue(undefined);
      const result = await notesController.remove(noteId);
      expect(notesService.remove).toHaveBeenCalledWith(noteId);
      expect(result).toBeUndefined();
    });
  });
});
