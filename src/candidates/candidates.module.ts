import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesController } from './controllers/candidates.controller';
import { InterviewsController } from './controllers/interviews.controller';
import { SoftInterviewsController } from './controllers/softInterviews.controller';

import { CandidatesService } from './services/candidates.service';
import { EducationService } from './services/education.service';
import { ExperienceService } from './services/experience.service';
import { InterviewService } from './services/interview.service';
import { SoftInterviewService } from './services/softInterview.service';

import { skillsToLevelsRepository } from '../users/repositories/skillsToLevels.repository';
import { positionRepository } from '../users/repositories/position.repository';
import { levelRepository } from '../users/repositories/level.repository';
import { skillRepository } from '../users/repositories/skill.repository';
import { candidateRepository } from './repositories/candidate.repository';
import { educationRepository } from './repositories/education.repository';
import { experienceRepository } from './repositories/experience.repository';
import { skillToInterviewRepository } from './repositories/skillToInterview.repository';
import { interviewRepository } from './repositories/interview.repository';
import { softInterviewRepository } from './repositories/softInerview.repository';
import { softSkillToSoftInterviewRepository } from './repositories/softSkillToSoftInterview.repository';
import { softSkillRepository } from '../users/repositories/softSkill.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      candidateRepository,
      educationRepository,
      experienceRepository,
      interviewRepository,
      skillToInterviewRepository,
      skillsToLevelsRepository,
      positionRepository,
      levelRepository,
      skillRepository,
      softInterviewRepository,
      softSkillToSoftInterviewRepository,
      softSkillRepository,
    ]),
  ],
  controllers: [
    CandidatesController,
    InterviewsController,
    SoftInterviewsController,
  ],
  providers: [
    CandidatesService,
    EducationService,
    ExperienceService,
    InterviewService,
    SoftInterviewService,
  ],
})
export class CandidatesModule {}
