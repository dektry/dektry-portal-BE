import { EntityRepository, Repository } from 'typeorm';
import { LanguageEntity } from '../entity/language.entity';

@EntityRepository(LanguageEntity)
export class languageRepository extends Repository<LanguageEntity> {}
