import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SkillGroupEntity } from './skillGroup.entity';
import { QuestionEntity } from './question.entity';
import { SkillsToLevelsEntity } from './skillsToLevels.entity';

@Entity({ name: 'skill' })
export class SkillEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @ManyToOne(() => SkillGroupEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'skill_group_id' })
  skill_group_id: SkillGroupEntity;

  @OneToMany(() => QuestionEntity, (question) => question.skill_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  questions: QuestionEntity[];

  @OneToMany(() => SkillsToLevelsEntity, (stl) => stl.skill_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  levels: SkillsToLevelsEntity[];
}
