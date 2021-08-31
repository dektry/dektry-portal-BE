import { ProjectHistoryEntity } from '../entity/projectHistory.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(ProjectHistoryEntity)
export class projectsHistoryRepository extends Repository<ProjectHistoryEntity> {}
