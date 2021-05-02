import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersRepository } from './repositories/users.repository';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';
import { roleRepository } from './repositories/role.repository';
import { permissionRepository } from './repositories/permission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      usersRepository,
      roleRepository,
      permissionRepository,
    ]),
  ],
  providers: [UsersService, RoleService, PermissionService],
  controllers: [UsersController, RoleController, PermissionController],
})
export class UsersModule {}
