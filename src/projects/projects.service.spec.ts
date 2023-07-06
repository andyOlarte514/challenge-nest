import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/project.dto';

describe('ProjectsService', () => {
  let projectsService: ProjectsService;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository, // Use the actual Repository class
        },
      ],
    }).compile();

    projectsService = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  it('should return all projects', async () => {
    const projects: Project[] = [
      { id: 1, name: 'Project 1' } as Project,
      { id: 2, name: 'Project 2' } as Project,
    ];
    jest.spyOn(projectRepository, 'find').mockResolvedValue(projects);

    const result = await projectsService.getAllProjects();

    expect(result).toEqual(projects);
    expect(projectRepository.find).toHaveBeenCalledWith({
      relations: ['owner', 'collaborators', 'notes'],
    });
  });

  it('should create a new project', async () => {
    const createProjectDto: CreateProjectDto = {
      name: 'New Project',
    } as CreateProjectDto;
    const createdProject: Project = { id: 1, name: 'New Project' } as Project;
    jest.spyOn(projectRepository, 'create').mockReturnValue(createdProject);
    jest.spyOn(projectRepository, 'save').mockResolvedValue(createdProject);

    const result = await projectsService.create(createProjectDto);

    expect(result).toEqual(createdProject);
    expect(projectRepository.create).toHaveBeenCalledWith(createProjectDto);
    expect(projectRepository.save).toHaveBeenCalledWith(createdProject);
  });

  it('should return a project by ID', async () => {
    const projectId = 1;
    const project: Project = { id: projectId, name: 'Project 1' } as Project;
    jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project);

    const result = await projectsService.getProjectById(projectId);

    expect(result).toEqual(project);
    expect(projectRepository.findOne).toHaveBeenCalledWith({
      where: { id: projectId },
      relations: ['owner', 'collaborators', 'notes'],
    });
  });

  it('should remove a project by ID', async () => {
    const projectId = 1;
    const project: Project = { id: projectId, name: 'Project 1' } as Project;
    jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project);
    jest.spyOn(projectRepository, 'delete').mockResolvedValue(undefined);

    await projectsService.remove(projectId);

    expect(projectRepository.delete).toHaveBeenCalledWith(projectId);
  });
});
