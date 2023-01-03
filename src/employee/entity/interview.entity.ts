import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';
import { SkillToInterviewEntity } from './skillToInterview.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';
import { PositionEntity } from '../../users/entity/position.entity';

@Entity({ name: 'employee_interview' })
export class InterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ length: 512, nullable: true })
  comment: string;

  @Column({ length: 32, default: 'Assessment' })
  type: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.interview, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @ManyToOne(() => CareerLevelEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'level_id' })
  level: CareerLevelEntity;

  @ManyToOne(() => PositionEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @OneToMany(() => SkillToInterviewEntity, (sti) => sti.interview_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  skills: SkillToInterviewEntity[];
}
