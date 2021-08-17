import { TemplatesEntity } from '../entity/templates.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TemplatesEntity)
export class templatesRepository extends Repository<TemplatesEntity> {}
