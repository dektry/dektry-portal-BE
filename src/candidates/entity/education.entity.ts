import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { CandidateEntity } from './candidate.entity';

@Entity({ name: 'education' })
export class EducationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pfId: number;

  @Column()
  school: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  from_year: number;

  @Column({ nullable: true })
  to_year: number;

  @Column()
  subject: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => CandidateEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate' })
  candidate: CandidateEntity;
}
