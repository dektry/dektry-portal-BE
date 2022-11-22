import {
  Controller,
  Body,
  Get,
  Param,
  UseGuards,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { CareerLevelEntity } from '../entity/careerLevel.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeleteResult } from 'typeorm';
import { LevelsService } from '../services/level.service';

export interface LevelProps {
  name: string;
}

@Controller('levels')
export class LevelsController {
  constructor(private LevelsService: LevelsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<CareerLevelEntity[]> {
    return this.LevelsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() levelProps: LevelProps): Promise<CareerLevelEntity> {
    return this.LevelsService.createLevel(levelProps);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateLevel(
    @Param('id') id: string,
    @Body() levelProps: LevelProps,
  ): Promise<CareerLevelEntity> {
    return this.LevelsService.updateLevel(id, levelProps);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteLevel(@Param('id') id: string): Promise<DeleteResult> {
    return this.LevelsService.deleteLevel(id);
  }
}
