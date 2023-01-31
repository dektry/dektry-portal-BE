import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { SoftSkillEntity } from './softSkill.entity';
import { CareerLevelEntity } from './careerLevel.entity';

@Entity({ name: 'soft_skill_levels' })
export class SoftSkillsToLevelsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @Column()
  order: number;

  @Column({ length: 512, default: '' })
  description: string;

  @ManyToOne(() => SoftSkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'skill_id' })
  skill_id: SoftSkillEntity;

  @ManyToOne(() => CareerLevelEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'level_id' })
  level_id: CareerLevelEntity;
}
