import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from './controllers/employee.controller';
import { EmployeeInterviewsController } from './controllers/interviews.controller';
import { EmployeeSoftAssessmentController } from './controllers/softAssessment.controller';

import { EmployeeService } from './services/employee.service';
import { EmployeeInterviewService } from './services/interview.service';
import { EmployeeSoftAssessmentService } from './services/softAssessment.service';

import { employeeRepository } from './repositories/employee.repository';
import { employeeInterviewRepository } from './repositories/interview.repository';
import { employeeSkillToInterviewRepository } from './repositories/skillToInterview.repository';
import { positionRepository } from '../users/repositories/position.repository';
import { levelRepository } from '../users/repositories/level.repository';
import { skillRepository } from '../users/repositories/skill.repository';
import { softSkillToSoftAssessmentRepository } from './repositories/softSkilltoSoftAssessment.repository';
import { softAssessmentRepository } from './repositories/softAssessment.repository';

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
    ]),
  ],
  controllers: [
    EmployeeController,
    EmployeeInterviewsController,
    EmployeeSoftAssessmentController,
  ],
  providers: [
    EmployeeService,
    EmployeeInterviewService,
    EmployeeSoftAssessmentService,
  ],
})
export class EmployeeModule {}
