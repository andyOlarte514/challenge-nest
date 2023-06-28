import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/project.dto';
import { Project } from './project.entity';
import { ProjectsRepository } from './projects.repository';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
  let projectsService: ProjectsService;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        ProjectsRepository,
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ] as Project[];
      jest.spyOn(projectsService, 'findAll').mockResolvedValue(projects);
      const result = await projectsController.findAll();
      expect(result).toEqual(projects);
      expect(projectsService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'New Project',
      } as CreateProjectDto;
      const createdProject = { id: 1, name: 'New Project' } as Project;
      jest.spyOn(projectRepository, 'create');
      jest.spyOn(projectsService, 'create').mockResolvedValue(createdProject);
      const result = await projectsController.create(createProjectDto);
      expect(result).toEqual(createdProject);
      expect(projectsService.create).toHaveBeenCalledWith(createProjectDto);
    });
  });

  describe('findOne', () => {
    it('should return a project by ID', async () => {
      const projectId = 1;
      const project = { id: projectId, name: 'Project 1' } as Project;
      jest.spyOn(projectsService, 'findOne').mockResolvedValue(project);
      const result = await projectsController.findOne(projectId);
      expect(result).toEqual(project);
      expect(projectsService.findOne).toHaveBeenCalledWith(projectId);
    });
  });

  describe('remove', () => {
    it('should remove a project by ID', async () => {
      const projectId = 1;
      jest.spyOn(projectsService, 'remove').mockResolvedValue(undefined);
      const result = await projectsController.remove(projectId);
      expect(result).toBeUndefined();
      expect(projectsService.remove).toHaveBeenCalledWith(projectId);
    });
  });
});
