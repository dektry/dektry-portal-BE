import { EntityRepository, Repository } from 'typeorm';
import { EnglishQuestionEntity } from '../entity/englishQuestion.entity';

@EntityRepository(EnglishQuestionEntity)
export class englishQuestionRepository extends Repository<EnglishQuestionEntity> {}
