import { CreateProjectDto } from './project.dto';

describe('Project Dto', () => {
  it('should be defined', () => {
    expect(new CreateProjectDto()).toBeDefined();
  });
});
