import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';

import {
  defaultMaxLength,
  languageLevels,
  languages,
} from '../utils/constants';

@Entity({ name: 'language' })
export class LanguageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  language: languages;

  @Column()
  languageLevel: languageLevels;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.languages, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}
