import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  relations = ['owner', 'collaborators', 'notes'];

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: this.relations,
    });
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: this.relations,
    });

    if (!project) {
      throw new NotFoundException('project not found');
    }

    return project;
  }

  async update(id: number, data: CreateProjectDto): Promise<Project> {
    const existingProject = await this.getProjectById(id);

    if (!existingProject) {
      throw new NotFoundException('project not found');
    }

    await this.projectRepository.update(id, data);

    return this.projectRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  async remove(id: number): Promise<void> {
    const project = await this.getProjectById(id);

    if (!project) {
      throw new NotFoundException('project not found');
    }

    await this.projectRepository.delete(id);
  }

  async getAllByOwnwer(ownerEmail: string): Promise<Project[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'user')
      .where('user.email = :ownerEmail', { ownerEmail })
      .leftJoinAndSelect('project.collaborators', 'collaborators')
      .leftJoinAndSelect('project.notes', 'notes')
      .getMany();
  }
}
