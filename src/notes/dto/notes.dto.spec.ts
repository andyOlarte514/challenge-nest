import { CreateNoteDto } from './note.dto';

describe('Note Dto', () => {
  it('should be defined', () => {
    expect(new CreateNoteDto()).toBeDefined();
  });
});
