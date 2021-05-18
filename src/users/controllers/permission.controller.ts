import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PermissionEntity } from '../entity/permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('permission')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() CreatePermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    return this.PermissionService.createPermission(CreatePermissionDto);
  }
}
