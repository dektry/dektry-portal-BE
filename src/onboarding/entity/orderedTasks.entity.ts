import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { TemplatesEntity } from './templates.entity';

@Entity({ name: 'onBoardingOrderedTasks' })
export class OrderedTasksEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TasksEntity, (task) => task.ordered, {
    cascade: true,
  })
  task: TasksEntity;

  @Column()
  index: number;

  @ManyToOne(() => TemplatesEntity, (template) => template.tasks)
  @JoinColumn()
  template: TemplatesEntity;
}
