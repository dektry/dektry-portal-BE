import { TemplatesEntity } from '../../onboarding/entity/templates.entity';
import { ArticleEntity } from '../../articles/entity/articles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AccessEntity } from './access.entity';
import { PositionGroupEntity } from './positionGroup.entity';
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

  @ManyToOne(() => AccessEntity, (access) => access.positions)
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
}
