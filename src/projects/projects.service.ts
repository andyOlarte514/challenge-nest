import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: this.relations,
    });
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findOne(id: number): Promise<Project> {
    return this.projectRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
