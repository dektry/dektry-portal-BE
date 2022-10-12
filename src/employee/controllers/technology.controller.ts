import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { TechnologyService } from '../services/technology.service';

@Controller('employee_projects')
export class EmployeeProjectController {
  constructor(private TechnologyService: TechnologyService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':projectId')
  getProject(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('query') query?: string,
  ) {
    return this.TechnologyService.getTechnologiesList({
      limit,
      order,
      query,
    });
  }
}
