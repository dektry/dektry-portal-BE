import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { SoftAssessmentEntity } from './softAssessment.entity';
import { SoftSkillEntity } from '../../users/entity/softSkill.entity';

@Entity({ name: 'soft_skill_to_assessment' })
export class SoftSkillToSoftAssessmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  softSkillScoreId: string;

  @Column({ length: 512, nullable: true })
  comment: string;

  @ManyToOne(() => SoftSkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'soft_skill_id' })
  soft_skill_id: SoftSkillEntity;

  @ManyToOne(() => SoftAssessmentEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'soft_assessment_id' })
  soft_assessment_id: SoftAssessmentEntity;
}
