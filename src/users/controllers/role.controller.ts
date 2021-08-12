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
import { RoleService } from '../services/role.service';
import { RoleEntity } from '../entity/role.entity';
import { Permission } from '../../decorators/permission.decorator';
import { Permissions } from '../../enums/permissions.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { DeleteResult } from 'typeorm';

interface RoleProps {
  name: string;
  permissions: string[];
}
@Controller('roles')
export class RoleController {
  constructor(private RoleService: RoleService) {}

  @Permission(Permissions.getAllRoles)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getAll(): Promise<RoleEntity[]> {
    return this.RoleService.getAll();
  }

  @Permission(Permissions.getRoleByName)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('/:name')
  getRoleByName(@Param('name') name: string): Promise<RoleEntity> {
    return this.RoleService.getRoleByName(name);
  }

  @Permission(Permissions.createRole)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  create(@Body() roleProps: RoleProps): Promise<RoleEntity> {
    return this.RoleService.createRole(roleProps);
  }

  @Permission(Permissions.updateRole)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateRole(
    @Param('id') id: string,
    @Body() roleProps: RoleProps,
  ): Promise<RoleEntity> {
    return this.RoleService.updateRole(id, roleProps);
  }

  @Permission(Permissions.deleteRole)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.RoleService.deleteRole(id);
  }
}
