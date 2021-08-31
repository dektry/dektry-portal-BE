import { ProjectEntity } from '../entity/project.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(ProjectEntity)
export class projectsRepository extends Repository<ProjectEntity> {}
