import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { SoftSkillToSoftAssessmentEntity } from './softSkillToSoftAssessment.entity';

@Entity({ name: 'question_to_soft_skill' })
export class QuestionToSoftSkillEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @ManyToOne(() => SoftSkillToSoftAssessmentEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'soft_skill_id' })
  soft_skill_id: SoftSkillToSoftAssessmentEntity;
}
