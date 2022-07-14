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

import { CandidateEntity } from './candidate.entity';
import { SoftSkillToSoftInterviewEntity } from './softSkillToSoftInterview.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';
import { PositionEntity } from '../../users/entity/position.entity';

@Entity({ name: 'soft_interview' })
export class SoftInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ length: 512, nullable: true })
  hobby: string;

  @Column({ length: 512, nullable: true })
  comment: string;

  @OneToOne(() => CandidateEntity, (candidate) => candidate.interview, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: CandidateEntity;

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

  @OneToMany(
    () => SoftSkillToSoftInterviewEntity,
    (sti) => sti.soft_interview_id,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn()
  skills: SoftSkillToSoftInterviewEntity[];
}
