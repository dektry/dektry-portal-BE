import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from './controllers/employee.controller';
import { EmployeeInterviewsController } from './controllers/interviews.controller';

import { EmployeeService } from './services/employee.service';
import { InterviewService } from './services/interview.service';

import { employeeRepository } from './repositories/employee.repository';
import { employeeInterviewRepository } from './repositories/interview.repository';
import { employeeSkillToInterviewRepository } from './repositories/skillToInterview.repository';
import { positionRepository } from '../users/repositories/position.repository';
import { levelRepository } from '../users/repositories/level.repository';
import { skillRepository } from '../users/repositories/skill.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      employeeRepository,
      employeeInterviewRepository,
      employeeSkillToInterviewRepository,
      positionRepository,
      levelRepository,
      skillRepository,
    ]),
  ],
  controllers: [EmployeeController, EmployeeInterviewsController],
  providers: [EmployeeService, InterviewService],
})
export class EmployeeModule {}
