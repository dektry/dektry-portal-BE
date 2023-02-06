import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'skill_levels_list' })
export class SkillLevelsList extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '' })
  name: string;
}
