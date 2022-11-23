import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionController } from './controllers/position.controller';
import { SkillGroupController } from './controllers/skillGroup.controller';
import { SoftSkillController } from './controllers/softSkill.controller';
import { LevelsController } from './controllers/level.controller';

import { SkillGroupService } from './services/skillGroup.service';
import { PositionService } from './services/position.service';
import { SoftSkillService } from './services/softSkill.service';
import { LevelsService } from './services/level.service';

import { skillGroupRepository } from './repositories/skillGroup.repository';
import { skillRepository } from './repositories/skill.repository';
import { questionRepository } from './repositories/question.repository';
import { skillsToLevelsRepository } from './repositories/skillsToLevels.repository';
import { softSkillRepository } from './repositories/softSkill.repository';
import { softSkillScoreRepository } from './repositories/softSkillScore.repository';
import { usersRepository } from './repositories/users.repository';
import { positionRepository } from './repositories/position.repository';
import { levelRepository } from './repositories/level.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      usersRepository,
      positionRepository,
      levelRepository,
      skillGroupRepository,
      skillRepository,
      questionRepository,
      skillsToLevelsRepository,
      softSkillRepository,
      softSkillScoreRepository,
    ]),
  ],
  providers: [
    SkillGroupService,
    SoftSkillService,
    PositionService,
    LevelsService,
  ],
  controllers: [
    PositionController,
    SkillGroupController,
    SoftSkillController,
    LevelsController,
  ],
  exports: [],
})
export class UsersModule {}
