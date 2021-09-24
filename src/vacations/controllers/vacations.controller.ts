import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Permission } from 'decorators/permission.decorator';
import { VacationsService } from '../services/vacations.service';
import { Permissions } from 'enums/permissions.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { VacationsEntity } from '../entity/vacations.entity';
import { SaveVacationDto } from '../dto/vacations.dto';

@Controller('vacations')
export class VacationsController {
  constructor(private VacationsService: VacationsService) {}

  @Permission(Permissions.getAllVacations)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getVacationsList(
    @Query('userId') userId: string,
    @Query('tabFilter') tabFilter: string,
  ) {
    return this.VacationsService.getVacationsList(userId, tabFilter);
  }

  @Permission(Permissions.createVacation)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  createVacation(
    @Body() SaveVacationDto: SaveVacationDto,
  ): Promise<VacationsEntity> {
    return this.VacationsService.createVacation(SaveVacationDto);
  }

  @Permission(Permissions.updateVacation)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put(':id')
  updateVacation(
    @Param('id') id: string,
    @Body() SaveVacationDto: SaveVacationDto,
  ): Promise<VacationsEntity> {
    return this.VacationsService.updateVacation(id, SaveVacationDto);
  }

  @Permission(Permissions.deleteVacation)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(':id')
  deleteArticle(@Param('id') id: string) {
    return this.VacationsService.deleteVacation(id);
  }
}
