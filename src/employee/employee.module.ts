import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from './controllers/employee.controller';
import { EmployeeInterviewsController } from './controllers/interviews.controller';
import { EmployeeSoftAssessmentController } from './controllers/softAssessment.controller';
import { ProjectsController } from './controllers/projects.controller';

import { EmployeeService } from './services/employee.service';
import { EmployeeInterviewService } from './services/interview.service';
import { EmployeeSoftAssessmentService } from './services/softAssessment.service';
import { ProjectService } from './services/project.service';

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
import { TechnologyController } from './controllers/technology.controller';
import { TechnologyService } from './services/technology.service';

@Module({
  imports: [
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
    ]),
  ],
  controllers: [
    EmployeeController,
    EmployeeInterviewsController,
    EmployeeSoftAssessmentController,
    ProjectsController,
    TechnologyController,
  ],
  providers: [
    EmployeeService,
    EmployeeInterviewService,
    EmployeeSoftAssessmentService,
    ProjectService,
    TechnologyService,
  ],
})
export class EmployeeModule {}
