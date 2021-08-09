import { TemplatesEntity } from '../../onboarding/entity/templates.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  ManyToMany,
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
}
