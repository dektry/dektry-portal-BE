import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { PositionGroupEntity } from '../../users/entity/positionGroup.entity';
import { GroupsEntity } from './groups.entity';
import { TasksEntity } from './tasks.entity';

@Entity({ name: 'onBoardingTemplates' })
export class TemplatesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @ManyToMany(() => TasksEntity, { cascade: true })
  @JoinTable({ name: 'onBoarding_templates_tasks' })
  tasks: TasksEntity[];

  @ManyToOne(() => GroupsEntity, (group) => group.template, {
    cascade: true,
    nullable: true,
  })
  group: GroupsEntity;

  @ManyToMany(() => PositionGroupEntity)
  @JoinTable({ name: 'onBoarding_templates_write' })
  write: PositionGroupEntity[];

  @ManyToMany(() => PositionGroupEntity)
  @JoinTable({ name: 'onBoarding_templates_read' })
  read: PositionGroupEntity[];
}
