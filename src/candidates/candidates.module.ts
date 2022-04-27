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
import { InterviewController } from './controllers/interview.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      candidateRepository,
      educationRepository,
      experienceRepository,
      languageRepository,
      interviewRepository,
      skillToInterviewRepository,
    ]),
  ],
  controllers: [CandidatesController, InterviewController],
  providers: [
    CandidatesService,
    EducationService,
    LanguageService,
    ExperienceService,
    InterviewService,
  ],
})
export class CandidatesModule {}
