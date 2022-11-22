import { TasksEntity } from '../entity/tasks.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TasksEntity)
export class tasksRepository extends Repository<TasksEntity> {}
