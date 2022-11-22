import { EntityRepository, Repository } from 'typeorm';
import { ArticleEntity } from '../entity/articles.entity';

@EntityRepository(ArticleEntity)
export class articleRepository extends Repository<ArticleEntity> {}
