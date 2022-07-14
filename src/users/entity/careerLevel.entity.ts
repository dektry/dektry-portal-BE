import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { SkillsToLevelsEntity } from './skillsToLevels.entity';
import { InterviewEntity } from '../../candidates/entity/interview.entity';
import { SoftInterviewEntity } from '../../candidates/entity/softInterview.entity';
@Entity({ name: 'careersLevels' })
export class CareerLevelEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SkillsToLevelsEntity, (stl) => stl.level_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  skills: SkillsToLevelsEntity[];

  @OneToMany(() => InterviewEntity, (interview) => interview.level, {
    orphanedRowAction: 'delete',
  })
  interview: InterviewEntity[];

  @OneToMany(
    () => SoftInterviewEntity,
    (softInterview) => softInterview.level,
    {
      orphanedRowAction: 'delete',
    },
  )
  softInterview: SoftInterviewEntity[];
}
