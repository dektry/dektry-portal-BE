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
import { positionGroupRepository } from './repositories/positionGroup.repository';
import { PositionGroupController } from './controllers/positionGroup.controller';
import { PositionGroupService } from './services/positionGroup.service';
import { projectsRepository } from '../projects/repositories/projects.repository';
import { projectsHistoryRepository } from '../projects/repositories/projectsHistory.repository';
import { accessRepository } from './repositories/access.repository';
import { LevelsController } from './controllers/level.controller';
import { LevelsService } from './services/level.service';
import { levelRepository } from './repositories/level.repository';
import { SkillGroupService } from './services/skillGroup.service';
import { SkillGroupController } from './controllers/skillGroup.controller';
import { skillGroupRepository } from './repositories/skillGroup.repository';
import { skillRepository } from './repositories/skill.repository';
import { questionRepository } from './repositories/question.repository';
import { skillsToLevelsRepository } from './repositories/skillsToLevels.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      projectsRepository,
      projectsHistoryRepository,
      usersRepository,
      roleRepository,
      permissionRepository,
      positionRepository,
      levelRepository,
      careerRepository,
      positionGroupRepository,
      accessRepository,
      skillGroupRepository,
      skillRepository,
      questionRepository,
      skillsToLevelsRepository,
    ]),
  ],
  providers: [
    UsersService,
    RoleService,
    PermissionService,
    PositionService,
    LevelsService,
    CareerService,
    PositionGroupService,
    SkillGroupService,
  ],
  controllers: [
    UsersController,
    RoleController,
    PermissionController,
    PositionController,
    LevelsController,
    CareerController,
    PositionGroupController,
    SkillGroupController,
  ],
  exports: [UsersService],
})
export class UsersModule {}
