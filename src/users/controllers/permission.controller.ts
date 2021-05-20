import { Controller, Body, Post, UseGuards, Get, Param } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PermissionEntity } from '../entity/permission.entity';
import { Permission } from 'src/decorators/permission.decorator';
import { Permissions } from 'src/enums/permissions.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller('permissions')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  @Permission(Permissions.getPermissionByName)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/:name')
  getByName(@Param('name') name: string): Promise<PermissionEntity> {
    return this.PermissionService.getByName(name);
  }

  @Permission(Permissions.createPermission)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() CreatePermissionDto): Promise<PermissionEntity> {
    return this.PermissionService.createPermission(CreatePermissionDto);
  }
}
