import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { QuestionToSoftSkillEntity } from 'employee/entity/questionToSoftSkill.entity';

@Entity({ name: 'soft_skill' })
export class SoftSkillEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @Column({ length: 512, default: '' })
  question: string;

  @OneToMany(
    () => QuestionToSoftSkillEntity,
    (question) => question.soft_skill_id,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn()
  questions: QuestionToSoftSkillEntity[];
}
