import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { EnglishSkillEntity } from './englishSkill.entity';

@Entity({ name: 'english_question' })
export class EnglishQuestionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  value: string;

  @Column()
  order: number;

  @ManyToOne(() => EnglishSkillEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'english_skill_id' })
  english_skill_id: EnglishSkillEntity;
}
