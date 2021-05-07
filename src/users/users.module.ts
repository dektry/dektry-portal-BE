import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { usersRepository } from './repositories/users.repository';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
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
  exports: [UsersService],
})
export class UsersModule {}
