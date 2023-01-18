import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EnglishSkillGroupEntity } from './englishSkillGroup.entity';
import { EnglishQuestionEntity } from './englishQuestion.entity';
import { EnglishSkillsToLevelsEntity } from './englishSkillsToLevels.entity';
import { SkillToInterviewEntity } from '../../candidates/entity/skillToInterview.entity';

@Entity({ name: 'skill' })
export class EnglishSkillEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @ManyToOne(() => EnglishSkillGroupEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'english_skill_group_id' })
  english_skill_group_id: EnglishSkillGroupEntity;

  @OneToMany(
    () => EnglishQuestionEntity,
    (question) => question.english_skill_id,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn()
  questions: EnglishQuestionEntity[];

  @OneToMany(() => EnglishSkillsToLevelsEntity, (stl) => stl.english_skill_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  levels: EnglishSkillsToLevelsEntity[];

  @OneToMany(() => SkillToInterviewEntity, (sti) => sti.skill_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  interviews: SkillToInterviewEntity[];
}
