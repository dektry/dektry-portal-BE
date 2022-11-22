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
import { PositionService } from '../services/position.service';
import { PositionEntity } from '../entity/position.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeleteResult } from 'typeorm';

export interface PositionProps {
  name: string;
  duties: string;
  requirements: string;
  salaryMinLimit: number;
  salaryMaxLimit: number;
}

@Controller('positions')
export class PositionController {
  constructor(private PositionService: PositionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<PositionEntity[]> {
    return this.PositionService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() positionProps: PositionProps): Promise<PositionEntity> {
    return this.PositionService.createPosition(positionProps);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateRole(
    @Param('id') id: string,
    @Body() positionProps: PositionProps,
  ): Promise<PositionEntity> {
    return this.PositionService.updatePosition(id, positionProps);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.PositionService.deletePosition(id);
  }
}
