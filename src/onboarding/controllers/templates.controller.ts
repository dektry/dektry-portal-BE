import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsEntity } from 'onboarding/entity/groups.entity';
import { TemplatesEntity } from 'onboarding/entity/templates.entity';
import { TemplatesService } from 'onboarding/services/templates.service';
import { DeleteResult } from 'typeorm';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { TasksEntity } from 'onboarding/entity/tasks.entity';

@Controller('templates')
export class TemplatesController {
  constructor(private TemplatesService: TemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() request): Promise<TemplatesEntity[]> {
    console.log('aa');
    return this.TemplatesService.getAll(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() CreateTemplateDto): Promise<TemplatesEntity> {
    return this.TemplatesService.createTemplate(CreateTemplateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateTemplate(
    @Param('id') id: string,
    @Body() templateProps,
  ): Promise<TemplatesEntity> {
    return this.TemplatesService.updateTemplate(id, templateProps);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteTemplate(@Param('id') id: string): Promise<DeleteResult> {
    return this.TemplatesService.deleteTemplate(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tasks')
  getAllTasks(): Promise<TasksEntity[]> {
    return this.TemplatesService.getAllTasks();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/tasks')
  createTask(@Body() CreateTaskDto): Promise<TasksEntity> {
    return this.TemplatesService.createTask(CreateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/tasks/:id')
  updateTask(@Param('id') id: string, @Body() taskProps): Promise<TasksEntity> {
    return this.TemplatesService.updateTask(id, taskProps);
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/tasks/:id')
  deleteTask(@Param('id') id: string): Promise<DeleteResult> {
    return this.TemplatesService.deleteTask(id);
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/groups')
  getAllGroups(): Promise<GroupsEntity[]> {
    return this.TemplatesService.getAllGroups();
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('/groups')
  createGroup(@Body() CreateGroupDto): Promise<GroupsEntity> {
    return this.TemplatesService.createGroup(CreateGroupDto);
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/groups/:id')
  updateGroup(
    @Param('id') id: string,
    @Body() groupProps,
  ): Promise<TemplatesEntity> {
    return this.TemplatesService.updateGroup(id, groupProps);
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/groups/:id')
  deleteGroup(@Param('id') id: string): Promise<DeleteResult> {
    return this.TemplatesService.deleteGroup(id);
  }
}
