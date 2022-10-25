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

@Entity({ name: 'language' })
export class LanguageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: defaultMaxLength })
  language: string;

  @Column({ length: 5 })
  languageLevel: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.languages, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}
