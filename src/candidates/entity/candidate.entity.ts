import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { LanguageEntity } from './language.entity';
import { InterviewEntity } from './interview.entity';

@Entity({ name: 'candidate' })
export class CandidateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pfId: number;

  @Column({ nullable: true })
  pfUpdatedAt: string;

  @Column({ length: 255, nullable: true })
  fullName: string;

  @Column({ length: 255, nullable: true })
  position: string;

  @Column({ length: 40, nullable: true })
  level: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ length: 40, nullable: true })
  timezone: string;

  @OneToMany(() => ExperienceEntity, (exp) => exp.candidate, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  experience: ExperienceEntity[];

  @Column({ length: 255, nullable: true })
  email: string;

  @OneToMany(() => EducationEntity, (edc) => edc.candidate, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  education: EducationEntity[];

  @ManyToMany(() => LanguageEntity, (lang) => lang.candidates)
  @JoinTable({ name: 'candidate_language' })
  languages: LanguageEntity[];

  @OneToOne(() => InterviewEntity, (interview) => interview.candidate)
  interview: InterviewEntity;
}
