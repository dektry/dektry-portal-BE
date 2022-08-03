import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { InterviewEntity } from './interview.entity';
import { SkillEntity } from '../../users/entity/skill.entity';

@Entity({ name: 'employee_skill_interview' })
export class SkillToInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @ManyToOne(() => SkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'skill_id' })
  skill_id: SkillEntity;

  @ManyToOne(() => InterviewEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'interview_id' })
  interview_id: InterviewEntity;
}
