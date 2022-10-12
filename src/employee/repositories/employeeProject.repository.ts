import { EntityRepository, Repository } from 'typeorm';
import { EmployeeProjectEntity } from '../entity/employeeProject.entity';

@EntityRepository(EmployeeProjectEntity)
export class employeeProjectRepository extends Repository<EmployeeProjectEntity> {}
