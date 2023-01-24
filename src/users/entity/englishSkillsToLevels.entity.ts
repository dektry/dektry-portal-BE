import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { EnglishSkillEntity } from './englishSkill.entity';
import { CareerLevelEntity } from './careerLevel.entity';

@Entity({ name: 'english_skill_levels' })
export class EnglishSkillsToLevelsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @Column({ length: 512, default: '' })
  description: string;

  @ManyToOne(() => EnglishSkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'skill_id' })
  english_skill_id: EnglishSkillEntity;

  @ManyToOne(() => CareerLevelEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'level_id' })
  level_id: CareerLevelEntity;
}
