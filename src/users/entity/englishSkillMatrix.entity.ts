import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { PositionEntity } from './position.entity';
import { EnglishSkillGroupEntity } from './englishSkillGroup.entity';

@Entity({ name: 'englishSkillMatrix' })
export class EnglishSkillMatrix extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => PositionEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @OneToMany(
    () => EnglishSkillGroupEntity,
    (skillGroup) => skillGroup.englishSkillMatrix,
  )
  englishSkillGroups: EnglishSkillGroupEntity[];
}
