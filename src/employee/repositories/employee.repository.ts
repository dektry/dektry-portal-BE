import { EntityRepository, Repository } from 'typeorm';
import { EmployeeEntity } from '../entity/employee.entity';

@EntityRepository(EmployeeEntity)
export class employeeRepository extends Repository<EmployeeEntity> {}
