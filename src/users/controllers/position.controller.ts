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
import { Permission } from '../../decorators/permission.decorator';
import { Permissions } from '../../enums/permissions.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
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

  @Permission(Permissions.getAllPositions)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getAll(): Promise<PositionEntity[]> {
    return this.PositionService.getAll();
  }

  @Permission(Permissions.createPosition, Permissions.updatePosition)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() positionProps: PositionProps): Promise<PositionEntity> {
    return this.PositionService.createPosition(positionProps);
  }

  @Permission(Permissions.createPosition, Permissions.updatePosition)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateRole(
    @Param('id') id: string,
    @Body() positionProps: PositionProps,
  ): Promise<PositionEntity> {
    return this.PositionService.updatePosition(id, positionProps);
  }

  @Permission(Permissions.deletePosition)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.PositionService.deletePosition(id);
  }
}
