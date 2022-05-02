import { Module } from '@nestjs/common';
import { CandidatesController } from './controllers/candidates.controller';
import { CandidatesService } from './services/candidates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { candidateRepository } from './repositories/candidate.repository';
import { educationRepository } from './repositories/education.repository';
import { experienceRepository } from './repositories/experience.repository';
import { languageRepository } from './repositories/language.repository';
import { skillToInterviewRepository } from './repositories/skillToInterview.repository';
import { interviewRepository } from './repositories/interview.repository';
import { EducationService } from './services/education.service';
import { LanguageService } from './services/language.service';
import { ExperienceService } from './services/experience.service';
import { InterviewService } from './services/interview.service';
import { InterviewsController } from './controllers/interviews.controller';
import { skillsToLevelsRepository } from '../users/repositories/skillsToLevels.repository';
import { positionRepository } from '../users/repositories/position.repository';
import { levelRepository } from '../users/repositories/level.repository';
import { skillRepository } from '../users/repositories/skill.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      candidateRepository,
      educationRepository,
      experienceRepository,
      languageRepository,
      interviewRepository,
      skillToInterviewRepository,
      skillsToLevelsRepository,
      positionRepository,
      levelRepository,
      skillRepository,
    ]),
  ],
  controllers: [CandidatesController, InterviewsController],
  providers: [
    CandidatesService,
    EducationService,
    LanguageService,
    ExperienceService,
    InterviewService,
  ],
})
export class CandidatesModule {}
