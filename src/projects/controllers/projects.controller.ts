import {
  Controller,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permission } from '../../decorators/permission.decorator';
import { Permissions } from '../../enums/permissions.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { ProjectsService } from '../services/projects.service';
import { ProjectDto } from '../dto/project.dto';
import { ProjectEntity } from '../entity/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private ProjectsService: ProjectsService) {}

  @Permission(Permissions.createProject)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  createProject(@Body() projectProps: ProjectDto): Promise<ProjectEntity> {
    return this.ProjectsService.createProject(projectProps);
  }
}
