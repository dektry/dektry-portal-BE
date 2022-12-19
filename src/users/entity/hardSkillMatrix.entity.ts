import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { PositionEntity } from '../entity/position.entity';
import { SkillGroupEntity } from '../entity/skillGroup.entity';

@Entity({ name: 'hardSkillMatrix' })
export class HardSkillMatrix extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PositionEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @OneToMany(() => SkillGroupEntity, (skillGroup) => skillGroup.hardSkillMatrix)
  skillGroups: SkillGroupEntity[];
}
