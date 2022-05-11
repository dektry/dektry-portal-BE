import { Module } from '@nestjs/common';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { employeeRepository } from './repositories/employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([employeeRepository])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
