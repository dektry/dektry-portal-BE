import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'soft_skill_score' })
export class SoftSkillScoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  key: string;

  @Column({ default: '' })
  value: string;

  @Column({ length: 512, default: '' })
  title: string;
}
