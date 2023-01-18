import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { SoftSkillsToLevelsEntity } from './softSkillsToLevels.entity';
import { SoftSkillMatrix } from './softSkillMatrix.entity';

@Entity({ name: 'soft_skill' })
export class SoftSkillEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @OneToMany(() => SoftSkillsToLevelsEntity, (stl) => stl.skill_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  levels: SoftSkillsToLevelsEntity[];

  @ManyToOne(() => SoftSkillMatrix, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'soft_skill_matrix_id' })
  softSkillMatrix: SoftSkillMatrix;
}
