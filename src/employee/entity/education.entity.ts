import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';
import { defaultMaxLength } from '../utils/constants';

@Entity({ name: 'education' })
export class EducationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: defaultMaxLength })
  university: string;

  @Column({ length: defaultMaxLength })
  specialization: string;

  @Column()
  startYear: number;

  @Column()
  endYear: number;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.educations, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}
