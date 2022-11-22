import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { ProjectDto } from '../dto/project.dto';
import { ProjectService } from '../services/project.service';

@Controller('projects')
export class ProjectsController {
  constructor(private ProjectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createProject(@Body() createProjectBody: ProjectDto) {
    return this.ProjectService.createProject(createProjectBody);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editProject(@Body() editProjectBody: ProjectDto) {
    return this.ProjectService.editProject(editProjectBody);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':projectId')
  deleteProject(@Param('projectId') projectId: string) {
    return this.ProjectService.deleteProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId/all')
  getProjectsList(@Param('employeeId') employeeId: string) {
    return this.ProjectService.getProjectsList(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':projectId')
  getProject(@Param('projectId') projectId: string) {
    return this.ProjectService.getProject(projectId);
  }
}
