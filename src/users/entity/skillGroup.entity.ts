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
}
