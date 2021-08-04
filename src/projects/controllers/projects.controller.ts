import {
  Controller,
  Body,
  Post,
  Put,
  Delete,
  Get,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Permission } from '../../decorators/permission.decorator';
import { Permissions } from '../../enums/permissions.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { ProjectsService } from '../services/projects.service';
import { ProjectDto } from '../dto/project.dto';
import { ProjectEntity } from '../entity/project.entity';
import { PaginationResultInterface } from '../../../interfaces/pagination.interface';

@Controller('projects')
export class ProjectsController {
  constructor(private ProjectsService: ProjectsService) {}

  @Permission(Permissions.getAllProjects)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getAllProjects(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<PaginationResultInterface<ProjectEntity>> {
    return this.ProjectsService.getAllProjects(page, limit);
  }

  @Permission(Permissions.getAllProjects)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/:name')
  getProjectsByName(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Param('name') name: string,
  ): Promise<PaginationResultInterface<ProjectEntity>> {
    return this.ProjectsService.findProjectByName(page, limit, name);
  }

  @Permission(Permissions.createProject)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  createProject(@Body() projectProps: ProjectDto): Promise<ProjectEntity> {
    return this.ProjectsService.createProject(projectProps);
  }

  @Permission(Permissions.createProject)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() projectProps: ProjectDto,
  ): Promise<ProjectEntity> {
    return this.ProjectsService.updateProject(id, projectProps);
  }

  @Permission(Permissions.deleteProject)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.ProjectsService.deleteProject(id);
  }
}
