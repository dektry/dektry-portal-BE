import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { SkillEntity } from './skill.entity';
import { CareerLevelEntity } from './careerLevel.entity';

@Entity({ name: 'skill_levels' })
export class SkillsToLevelsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @ManyToOne(() => SkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'skill_id' })
  skill_id: SkillEntity;

  @ManyToOne(() => CareerLevelEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'level_id' })
  level_id: CareerLevelEntity;
}
