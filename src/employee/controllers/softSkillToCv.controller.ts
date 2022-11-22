import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  Param,
  Post,
  Body,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { SoftSkillToCvService } from '../services/softSkillToCv.service';

@Controller('softSkillToCv')
export class SoftSkillToCvController {
  constructor(private SoftSkillToCvService: SoftSkillToCvService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':employeeId')
  createSoftSkillsToCv(
    @Body() createSkillsToCvBody: string[],
    @Param('employeeId') employeeId: string,
  ) {
    return this.SoftSkillToCvService.createSoftSkillsToCv(
      createSkillsToCvBody,
      employeeId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getSoftSkillsToCvList(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('query') query?: string,
  ) {
    return this.SoftSkillToCvService.getSoftSkillsToCvList({
      limit,
      order,
      query,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId')
  getSoftSkillsToCvOfEmployee(@Param('employeeId') employeeId: string) {
    return this.SoftSkillToCvService.getSoftSkillsToCvOfEmployee(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':softSkillToCvId')
  deleteTechnology(@Param('softSkillToCvId') softSkillToCvId: string) {
    return this.SoftSkillToCvService.deleteSoftSkillToCv(softSkillToCvId);
  }
}
