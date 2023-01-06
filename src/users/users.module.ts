import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionController } from './controllers/position.controller';
import { SkillGroupController } from './controllers/skillGroup.controller';
import { SoftSkillMatrixController } from './controllers/softSkillMatrix.controller';
import { LevelsController } from './controllers/level.controller';
import { HardSkillMatrixController } from './controllers/hardSkillMatrix.controller';

import { SkillGroupService } from './services/skillGroup.service';
import { PositionService } from './services/position.service';
import { SoftSkillMatrixService } from './services/softSkillMatrix.service';
import { LevelsService } from './services/level.service';
import { HardSkillMatrixService } from './services/hardSkillMatrix.service';

import { skillGroupRepository } from './repositories/skillGroup.repository';
import { skillRepository } from './repositories/skill.repository';
import { questionRepository } from './repositories/question.repository';
import { skillsToLevelsRepository } from './repositories/skillsToLevels.repository';
import { softSkillRepository } from './repositories/softSkill.repository';
import { softSkillScoreRepository } from './repositories/softSkillScore.repository';
import { usersRepository } from './repositories/users.repository';
import { positionRepository } from './repositories/position.repository';
import { levelRepository } from './repositories/level.repository';
import { hardSkillMatrixRepository } from './repositories/hardSkillMatrix.repository';
import { softSkillMatrixRepository } from './repositories/softSkillMatrix.repository';
import { softSkillsToLevelsRepository } from './repositories/softSkillsToLevels.repository';

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
      hardSkillMatrixRepository,
      softSkillMatrixRepository,
      softSkillsToLevelsRepository,
    ]),
  ],
  providers: [
    SkillGroupService,
    SoftSkillMatrixService,
    PositionService,
    LevelsService,
    HardSkillMatrixService,
  ],
  controllers: [
    PositionController,
    SkillGroupController,
    SoftSkillMatrixController,
    LevelsController,
    HardSkillMatrixController,
  ],
  exports: [HardSkillMatrixService],
})
export class UsersModule {}
