import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { TechnologyService } from '../services/technology.service';

@Controller('technologies')
export class TechnologyController {
  constructor(private TechnologyService: TechnologyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
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

  @UseGuards(JwtAuthGuard)
  @Delete(':technologyId')
  deleteTechnology(@Param('technologyId') technologyId: string) {
    return this.TechnologyService.deleteTechnology(technologyId);
  }
}
