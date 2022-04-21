import { Module } from '@nestjs/common';
import { CandidatesController } from './controllers/candidates.controller';
import { CandidatesService } from './services/candidates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { candidateRepository } from './repositories/candidate.repository';
import { educationRepository } from './repositories/education.repository';
import { experienceRepository } from './repositories/experience.repository';
import { languageRepository } from './repositories/language.repository';
import { EducationService } from './services/education.service';
import { LanguageService } from './services/language.service';
import { ExperienceService } from './services/experience.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      candidateRepository,
      educationRepository,
      experienceRepository,
      languageRepository,
    ]),
  ],
  controllers: [CandidatesController],
  providers: [
    CandidatesService,
    EducationService,
    LanguageService,
    ExperienceService,
  ],
})
export class CandidatesModule {}
