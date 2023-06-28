import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateNoteDto } from './dto/note.dto';

describe('NotesService', () => {
  let notesService: NotesService;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto = {
        title: 'title test',
        content: 'Test note',
      };
      const createdNote: Note = {
        id: 1,
        content: 'Test note',
        project: {} as any,
      } as Note;
      jest.spyOn(noteRepository, 'create').mockReturnValue(createdNote);
      jest.spyOn(noteRepository, 'save').mockResolvedValue(createdNote);
      const result = await notesService.create(createNoteDto as CreateNoteDto);
      expect(noteRepository.create).toHaveBeenCalledWith(createNoteDto);
      expect(noteRepository.save).toHaveBeenCalledWith(createdNote);
      expect(result).toEqual(createdNote);
    });
  });

  describe('findAll', () => {
    it('should return all notes', async () => {
      const notes: Note[] = [
        { id: 1, content: 'Note 1', project: {} as any },
      ] as Note[];
      jest.spyOn(noteRepository, 'find').mockResolvedValue(notes);
      const result = await notesService.findAll();
      expect(noteRepository.find).toHaveBeenCalledWith({
        relations: ['project'],
      });
      expect(result).toEqual(notes);
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
      jest.spyOn(noteRepository, 'findOne').mockResolvedValue(note);
      const result = await notesService.findOne(noteId);
      expect(noteRepository.findOne).toHaveBeenCalledWith({
        where: { id: noteId },
        relations: ['project'],
      });
      expect(result).toEqual(note);
    });
  });

  describe('remove', () => {
    it('should remove a note by ID', async () => {
      const noteId = 1;
      jest.spyOn(noteRepository, 'delete').mockResolvedValue(undefined);
      await notesService.remove(noteId);
      expect(noteRepository.delete).toHaveBeenCalledWith(noteId);
    });
  });
});
