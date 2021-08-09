import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PositionEntity } from '../../users/entity/position.entity';
import { PositionGroupEntity } from '../../users/entity/positionGroup.entity';
import { GroupsEntity } from './groups.entity';
import { OrderedTasksEntity } from './orderedTasks.entity';

@Entity({ name: 'onBoardingTemplates' })
export class TemplatesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @OneToMany(() => OrderedTasksEntity, (task) => task.template, {
    cascade: true,
  })
  @JoinColumn()
  tasks: OrderedTasksEntity[];

  @ManyToOne(() => PositionEntity, (position) => position.templates, {
    cascade: true,
    nullable: true,
  })
  target: PositionEntity;

  @ManyToOne(() => GroupsEntity, (group) => group.template, {
    cascade: true,
    nullable: true,
  })
  group: GroupsEntity;

  @ManyToMany(() => PositionEntity, (position) => position.templatesWrite, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'onBoarding_templates_write' })
  write: PositionEntity[];

  @ManyToMany(() => PositionEntity, (position) => position.templatesRead, {
    cascade: true,
    nullable: true,
  })
  @JoinTable({ name: 'onBoarding_templates_read' })
  read: PositionEntity[];
}
