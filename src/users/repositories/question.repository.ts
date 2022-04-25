import { EntityRepository, Repository } from 'typeorm';
import { QuestionEntity } from '../entity/question.entity';

@EntityRepository(QuestionEntity)
export class questionRepository extends Repository<QuestionEntity> {}
