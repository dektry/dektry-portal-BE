import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { AccessEntity } from './access.entity';
import { PositionGroupEntity } from './positionGroup.entity';
import { CareerLevelEntity } from './careerLevel.entity';
import { SkillGroupEntity } from './skillGroup.entity';
import { InterviewEntity } from '../../candidates/entity/interview.entity';
import { TemplatesEntity } from '../../onboarding/entity/templates.entity';
import { ArticleEntity } from '../../articles/entity/articles.entity';

@Entity({ name: 'positions' })
export class PositionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  duties: string;

  @Column()
  requirements: string;

  @Column()
  salaryMinLimit: number;

  @Column()
  salaryMaxLimit: number;

  @ManyToOne(
    () => PositionGroupEntity,
    (positionGroup) => positionGroup.positions,
  )
  group: PositionGroupEntity;

  @ManyToMany(() => AccessEntity, (access) => access.positions, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'positions_access' })
  access: AccessEntity[];

  @OneToMany(() => TemplatesEntity, (templates) => templates.target, {
    nullable: true,
  })
  templates: TemplatesEntity[];

  @ManyToMany(() => TemplatesEntity, (template) => template.write)
  templatesWrite: TemplatesEntity[];

  @ManyToMany(() => TemplatesEntity, (template) => template.read)
  templatesRead: TemplatesEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.edit_positions, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'article_edit_positions' })
  edit: ArticleEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.read_positions, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'article_read_positions' })
  read: ArticleEntity[];

  @ManyToMany(() => CareerLevelEntity, (level) => level.name, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'level_positions' })
  level: CareerLevelEntity[];

  @OneToMany(() => SkillGroupEntity, (skillGroup) => skillGroup.position_id, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  skillGroups: SkillGroupEntity[];

  @OneToMany(() => InterviewEntity, (interview) => interview.position, {
    orphanedRowAction: 'delete',
  })
  interview: InterviewEntity[];
}
