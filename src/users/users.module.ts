import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers/users.controller';
import { RoleController } from './controllers/role.controller';
import { PositionController } from './controllers/position.controller';
import { PermissionController } from './controllers/permission.controller';
import { LevelsController } from './controllers/level.controller';
import { CareerController } from './controllers/career.controller';
import { SkillGroupController } from './controllers/skillGroup.controller';
import { PositionGroupController } from './controllers/positionGroup.controller';
import { SoftSkillController } from './controllers/softSkill.controller';

import { UsersService } from './services/users.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { SkillGroupService } from './services/skillGroup.service';
import { PositionService } from './services/position.service';
import { LevelsService } from './services/level.service';
import { CareerService } from './services/career.service';
import { PositionGroupService } from './services/positionGroup.service';
import { SoftSkillService } from './services/softSkill.service';

import { careerRepository } from './repositories/career.repository';
import { positionGroupRepository } from './repositories/positionGroup.repository';
import { accessRepository } from './repositories/access.repository';
import { skillGroupRepository } from './repositories/skillGroup.repository';
import { skillRepository } from './repositories/skill.repository';
import { questionRepository } from './repositories/question.repository';
import { skillsToLevelsRepository } from './repositories/skillsToLevels.repository';
import { softSkillRepository } from './repositories/softSkill.repository';
import { softSkillScoreRepository } from './repositories/softSkillScore.repository';
import { usersRepository } from './repositories/users.repository';
import { roleRepository } from './repositories/role.repository';
import { permissionRepository } from './repositories/permission.repository';
import { positionRepository } from './repositories/position.repository';
import { levelRepository } from './repositories/level.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
      softSkillRepository,
      softSkillScoreRepository,
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
    SoftSkillService,
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
    SoftSkillController,
  ],
  exports: [UsersService],
})
export class UsersModule {}
