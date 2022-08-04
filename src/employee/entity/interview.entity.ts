import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';
import { SkillToInterviewEntity } from './skillToInterview.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';
import { PositionEntity } from '../../users/entity/position.entity';

@Entity({ name: 'employee_interview' })
export class InterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: true })
  isApproved: boolean;

  @Column({ length: 512, nullable: true })
  comment: string;

  @OneToOne(() => EmployeeEntity, (employee) => employee.interview, {
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
