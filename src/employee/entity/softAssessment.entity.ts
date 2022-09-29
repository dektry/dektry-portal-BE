import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';
import { SoftSkillToSoftAssessmentEntity } from './softSkillToSoftAssessment.entity';

@Entity({ name: 'soft_interview' })
export class SoftAssessmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ length: 512, nullable: true })
  comment: string;

  @OneToOne(() => EmployeeEntity, (employee) => employee.interview, {
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
}
