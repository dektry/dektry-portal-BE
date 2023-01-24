import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { EnglishSkillEntity } from './englishSkill.entity';
import { PositionEntity } from './position.entity';
import { EnglishSkillMatrix } from './englishSkillMatrix.entity';

@Entity({ name: 'englishSkillGroup' })
export class EnglishSkillGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @OneToMany(
    () => EnglishSkillEntity,
    (skill) => skill.english_skill_group_id,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn()
  english_skills: EnglishSkillEntity[];

  @ManyToOne(() => PositionEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'position_id' })
  position_id: PositionEntity;

  @ManyToOne(() => EnglishSkillMatrix, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'english_skill_matrix_id' })
  englishSkillMatrix: EnglishSkillMatrix;
}
