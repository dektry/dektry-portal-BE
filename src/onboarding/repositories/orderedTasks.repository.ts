import { EntityRepository, Repository } from 'typeorm';
import { OrderedTasksEntity } from 'onboarding/entity/orderedTasks.entity';

@EntityRepository(OrderedTasksEntity)
export class orderedTasksRepository extends Repository<OrderedTasksEntity> {}
