import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  Index,
  Unique,
} from 'typeorm';
import { CandidateEntity } from './candidate.entity';

@Entity({ name: 'language' })
@Unique(['level', 'code'])
export class LanguageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pfId: number;

  @Column({ length: 40 })
  @Index()
  code: string;

  @Column({ length: 40 })
  level: string;

  @ManyToMany(() => CandidateEntity, (candidate) => candidate.languages, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  candidates: CandidateEntity[];
}
