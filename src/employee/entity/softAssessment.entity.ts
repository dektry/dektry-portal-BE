import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';
import { SoftSkillToSoftAssessmentEntity } from './softSkillToSoftAssessment.entity';
import { PositionEntity } from '../../users/entity/position.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';

@Entity({ name: 'soft_assessment' })
export class SoftAssessmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ default: '' })
  comment: string;

  @Column({ default: 'Assessment' })
  type: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.interview, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @OneToMany(
    () => SoftSkillToSoftAssessmentEntity,
    (sti) => sti.soft_assessment_id,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn()
  skills: SoftSkillToSoftAssessmentEntity[];

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
}
