import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from './controllers/employee.controller';
import { EmployeeInterviewsController } from './controllers/interviews.controller';
import { EmployeeSoftAssessmentController } from './controllers/softAssessment.controller';
import { ProjectsController } from './controllers/projects.controller';
import { TechnologyController } from './controllers/technology.controller';
import { SoftSkillToCvController } from './controllers/softSkillToCv.controller';
import { LanguageController } from './controllers/language.controller';
import { EducationController } from './controllers/education.controller';

import { EmployeeService } from './services/employee.service';
import { EmployeeInterviewService } from './services/interview.service';
import { EmployeeSoftAssessmentService } from './services/softAssessment.service';
import { ProjectService } from './services/project.service';
import { LanguageService } from './services/language.service';
import { TechnologyService } from './services/technology.service';
import { SoftSkillToCvService } from './services/softSkillToCv.service';
import { EducationService } from './services/education.service';

import { employeeRepository } from './repositories/employee.repository';
import { employeeInterviewRepository } from './repositories/interview.repository';
import { employeeSkillToInterviewRepository } from './repositories/skillToInterview.repository';
import { positionRepository } from '../users/repositories/position.repository';
import { levelRepository } from '../users/repositories/level.repository';
import { skillRepository } from '../users/repositories/skill.repository';
import { softSkillToSoftAssessmentRepository } from './repositories/softSkilltoSoftAssessment.repository';
import { softAssessmentRepository } from './repositories/softAssessment.repository';
import { questionToSoftSkillRepository } from './repositories/questionToSkill.repository';
import { technologyRepository } from './repositories/technology.repository';
import { projectRepository } from './repositories/project.repository';
import { hardSkillMatrixRepository } from '../users/repositories/hardSkillMatrix.repository';
import { educationRepository } from './repositories/education.repository';
import { languageRepository } from './repositories/language.repository';
import { softSkillToCvRepository } from './repositories/softSkillToCv.repository';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      employeeRepository,
      employeeInterviewRepository,
      employeeSkillToInterviewRepository,
      softSkillToSoftAssessmentRepository,
      softAssessmentRepository,
      positionRepository,
      levelRepository,
      skillRepository,
      questionToSoftSkillRepository,
      technologyRepository,
      projectRepository,
      softSkillToCvRepository,
      educationRepository,
      languageRepository,
      hardSkillMatrixRepository,
    ]),
  ],
  controllers: [
    EmployeeController,
    EmployeeInterviewsController,
    EmployeeSoftAssessmentController,
    ProjectsController,
    TechnologyController,
    SoftSkillToCvController,
    EducationController,
    LanguageController,
  ],
  providers: [
    EmployeeService,
    EmployeeInterviewService,
    EmployeeSoftAssessmentService,
    ProjectService,
    TechnologyService,
    SoftSkillToCvService,
    EducationService,
    LanguageService,
  ],
})
export class EmployeeModule {}
