import { TemplatesEntity } from '../../onboarding/entity/templates.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
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
}
