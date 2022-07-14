import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { SoftInterviewEntity } from './softInterview.entity';
import { SoftSkillEntity } from '../../users/entity/softSkill.entity';

@Entity({ name: 'soft_skill_to_interview' })
export class SoftSkillToSoftInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => SoftSkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'soft_skill_id' })
  soft_skill_id: SoftSkillEntity;

  @ManyToOne(() => SoftInterviewEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'soft_interview_id' })
  soft_interview_id: SoftInterviewEntity;
}
