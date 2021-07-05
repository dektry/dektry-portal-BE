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
import { CareerService } from 'users/services/career.service';
import { CareerEntity } from 'users/entity/career.entity';
import { UserEntity } from 'users/entity/user.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { DeleteResult } from 'typeorm';

export interface CareerProps {
  user: UserEntity;
  salary: number;
  from: Date;
  to: Date;
  position: PositionEntity;
}

@Controller('careers')
export class CareerController {
  constructor(private CareerService: CareerService) {}

  @Permission(Permissions.getAllPositions)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/:id')
  getByUser(@Param('id') id: string): Promise<CareerEntity[]> {
    return this.CareerService.getByUser(id);
  }

  @Permission(Permissions.createPosition, Permissions.updatePosition)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() careerProps: CareerProps): Promise<CareerEntity> {
    return this.CareerService.createCareer(careerProps);
  }

  @Permission(Permissions.createPosition, Permissions.updatePosition)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateRole(
    @Param('id') id: string,
    @Body() careerProps: CareerProps,
  ): Promise<CareerEntity> {
    return this.CareerService.updateCareer(id, careerProps);
  }

  @Permission(Permissions.deletePosition)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.CareerService.deleteCareer(id);
  }
}
