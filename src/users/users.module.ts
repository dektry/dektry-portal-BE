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
import { PositionController } from './controllers/position.controller';
import { PositionService } from './services/position.service';
import { positionRepository } from './repositories/position.repository';
import { CareerController } from './controllers/career.controller';
import { CareerService } from './services/career.service';
import { careerRepository } from './repositories/career.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      usersRepository,
      roleRepository,
      permissionRepository,
      positionRepository,
      careerRepository,
    ]),
  ],
  providers: [
    UsersService,
    RoleService,
    PermissionService,
    PositionService,
    CareerService,
  ],
  controllers: [
    UsersController,
    RoleController,
    PermissionController,
    PositionController,
    CareerController,
  ],
  exports: [UsersService],
})
export class UsersModule {}
