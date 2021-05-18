import { Controller, Body, Post, UseGuards, Get, Param } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PermissionEntity } from '../entity/permission.entity';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('permissions')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:name')
  getByName(@Param('name') name: string): Promise<PermissionEntity> {
    return this.PermissionService.getByName(name);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() CreatePermissionDto): Promise<PermissionEntity> {
    return this.PermissionService.createPermission(CreatePermissionDto);
  }
}
