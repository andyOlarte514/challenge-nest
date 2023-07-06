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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: number) {
    return this.projectsService.getProjectById(id);
  }

  @Put(':id')
  async updateProject(@Param('id') id: number, @Body() data: CreateProjectDto) {
    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }

  @Get('/by-owner/:ownerEmail')
  async getAllByOwnwer(@Param('ownerEmail') ownerEmail: string) {
    return this.projectsService.getAllByOwnwer(ownerEmail);
  }
}
