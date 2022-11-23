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

import { PositionService } from '../services/position.service';
import { PositionEntity } from '../entity/position.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { PositionDto } from '../dto/position.dto';

@ApiBearerAuth()
@Controller('positions')
@ApiTags('Postions')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class PositionController {
  constructor(private PositionService: PositionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      example: [
        {
          id: '5be46995-ae6e-4cdc-89d8-c3a7fc6c49d9',
          name: 'Full stack developer',
        },
      ],
    },
  })
  getAll(): Promise<PositionEntity[]> {
    return this.PositionService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: PositionDto })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        name: 'Front-end developer',
        id: '104fd79d-6b89-4d92-b9c7-52f3b610b74d',
      },
    },
  })
  create(@Body() positionProps: PositionDto): Promise<PositionEntity> {
    return this.PositionService.createPosition(positionProps);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBody({ type: PositionDto })
  @ApiParam({ name: 'id', required: true, description: 'This is positionId' })
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
  updatePosition(
    @Param('id') id: string,
    @Body() positionProps: PositionDto,
  ): Promise<PositionEntity> {
    return this.PositionService.updatePosition(id, positionProps);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, description: 'This is positionId' })
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
  deletePosition(@Param('id') id: string): Promise<DeleteResult> {
    return this.PositionService.deletePosition(id);
  }
}
