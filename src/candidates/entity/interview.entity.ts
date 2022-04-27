import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { CandidateEntity } from './candidate.entity';
import { SkillToInterviewEntity } from './SkillToInterview.entity';

@Entity({ name: 'interview' })
export class InterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @OneToOne(() => CandidateEntity, (candidate) => candidate.interview, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: CandidateEntity;

  @OneToMany(() => SkillToInterviewEntity, (sti) => sti.interview_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  skills: SkillToInterviewEntity[];
}
