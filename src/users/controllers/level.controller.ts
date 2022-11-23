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
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { DeleteResult } from 'typeorm';

import { CareerLevelEntity } from '../entity/careerLevel.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { LevelsService } from '../services/level.service';

import { LevelDto } from '../dto/level.dto';

@ApiBearerAuth()
@Controller('levels')
@ApiTags('Postion-levels')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class LevelsController {
  constructor(private LevelsService: LevelsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      example: [
        {
          name: 'Junior',
          id: 'c59dd931-39df-4007-a229-74fff3a7614d',
        },
      ],
    },
  })
  getAll(): Promise<CareerLevelEntity[]> {
    return this.LevelsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: LevelDto })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        name: 'Junior',
        id: 'c59dd931-39df-4007-a229-74fff3a7614d',
      },
    },
  })
  create(@Body() levelProps: LevelDto): Promise<CareerLevelEntity> {
    return this.LevelsService.createLevel(levelProps);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBody({ type: LevelDto })
  @ApiParam({ name: 'id', required: true, description: 'This is levelId' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        name: 'Rename',
        id: 'c59dd931-39df-4007-a229-74fff3a7614d',
      },
    },
  })
  updateLevel(
    @Param('id') id: string,
    @Body() levelProps: LevelDto,
  ): Promise<CareerLevelEntity> {
    return this.LevelsService.updateLevel(id, levelProps);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiParam({ name: 'id', required: true, description: 'This is levelId' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        raw: [],
        affected: 1,
      },
    },
  })
  deleteLevel(@Param('id') id: string): Promise<DeleteResult> {
    return this.LevelsService.deleteLevel(id);
  }
}
