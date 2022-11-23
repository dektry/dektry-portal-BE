import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { CareerLevelEntity } from './careerLevel.entity';
import { SkillGroupEntity } from './skillGroup.entity';
import { InterviewEntity } from '../../candidates/entity/interview.entity';

@Entity({ name: 'positions' })
export class PositionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @ManyToMany(() => CareerLevelEntity, (level) => level.name, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'level_positions' })
  level: CareerLevelEntity[];

  @OneToMany(() => SkillGroupEntity, (skillGroup) => skillGroup.position_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  skillGroups: SkillGroupEntity[];

  @OneToMany(() => InterviewEntity, (interview) => interview.position, {
    orphanedRowAction: 'delete',
  })
  interview: InterviewEntity[];
}
