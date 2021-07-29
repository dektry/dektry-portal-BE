import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupsEntity } from 'onboarding/entity/groups.entity';
import { TemplatesEntity } from 'onboarding/entity/templates.entity';
import { TemplatesService } from 'onboarding/services/templates.service';
import { DeleteResult } from 'typeorm';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';

@Controller('templates')
export class TemplatesController {
  constructor(private TemplatesService: TemplatesService) {}

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getAll(): Promise<TemplatesEntity[]> {
    return this.TemplatesService.getAll();
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() CreateTemplateDto): Promise<TemplatesEntity> {
    return this.TemplatesService.createTemplate(CreateTemplateDto);
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateTemplate(
    @Param('id') id: string,
    @Body() templateProps,
  ): Promise<TemplatesEntity> {
    return this.TemplatesService.updateTemplate(id, templateProps);
  }

  @Permission(Permissions.workWithOnBoardingTemplates)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteTemplate(@Param('id') id: string): Promise<DeleteResult> {
    return this.TemplatesService.deleteTemplate(id);
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
