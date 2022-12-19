import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { SkillEntity } from './skill.entity';
import { PositionEntity } from './position.entity';
import { HardSkillMatrix } from '../entity/hardSkillMatrix.entity';

@Entity({ name: 'skillGroup' })
export class SkillGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @OneToMany(() => SkillEntity, (skill) => skill.skill_group_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  skills: SkillEntity[];

  @ManyToOne(() => PositionEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'position_id' })
  position_id: PositionEntity;

  @ManyToOne(() => HardSkillMatrix, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hard_skill_matrix_id' })
  hardSkillMatrix: HardSkillMatrix;
}
