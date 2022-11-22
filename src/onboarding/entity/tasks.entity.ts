import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrderedTasksEntity } from './orderedTasks.entity';

@Entity({ name: 'onBoardingTasks' })
export class TasksEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  title: string;

  @Column()
  description: string;

  @OneToMany(() => OrderedTasksEntity, (orderedTask) => orderedTask.task)
  @JoinColumn()
  ordered: OrderedTasksEntity[];
}
