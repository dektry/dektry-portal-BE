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
import { EmployeeProjectDto } from '../dto/employeeProject.dto';
import { EmployeeProjectService } from '../services/employeeProject.service';

@Controller('employee_projects')
export class EmployeeProjectController {
  constructor(private EmployeeProjectService: EmployeeProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createProject(@Body() createProjectBody: EmployeeProjectDto) {
    return this.EmployeeProjectService.createProject(createProjectBody);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editProject(@Body() editProjectBody: EmployeeProjectDto) {
    return this.EmployeeProjectService.editProject(editProjectBody);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':projectId')
  deleteProject(@Param('projectId') projectId: string) {
    return this.EmployeeProjectService.deleteProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId')
  getProjectsList(@Param('employeeId') employeeId: string) {
    return this.EmployeeProjectService.getProjectsList(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':projectId')
  getProject(@Param('projectId') projectId: string) {
    return this.EmployeeProjectService.getProject(projectId);
  }
}
