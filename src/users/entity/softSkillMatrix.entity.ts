import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { PositionEntity } from './position.entity';
import { SoftSkillEntity } from './softSkill.entity';

@Entity({ name: 'softSkillMatrix' })
export class SoftSkillMatrix extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PositionEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @OneToMany(() => SoftSkillEntity, (skill) => skill.softSkillMatrix)
  skills: SoftSkillEntity[];
}
