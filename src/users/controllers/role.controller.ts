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
import { Permission } from 'src/decorators/permission.decorator';
import { Permissions } from 'src/enums/permissions.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { resultResponse } from '../user.intrfaces';

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
  create(@Body() createUserDto): Promise<RoleEntity> {
    return this.RoleService.createRole(createUserDto);
  }

  @Permission(Permissions.updateRole)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateRole(@Param('id') id: string, @Body() roleProps): Promise<RoleEntity> {
    return this.RoleService.updateRole(id, roleProps);
  }

  @Permission(Permissions.deleteRole)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<resultResponse> {
    return this.RoleService.deleteRole(id);
  }
}
