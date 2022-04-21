import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { CandidateEntity } from './candidate.entity';

@Entity({ name: 'experience' })
export class ExperienceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pfId: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  starts_on: Date;

  @Column({ nullable: true })
  ends_on: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => CandidateEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate' })
  candidate: CandidateEntity;
}
