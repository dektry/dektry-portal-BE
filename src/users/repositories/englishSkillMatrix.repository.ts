import { EntityRepository, Repository } from 'typeorm';
import { EnglishSkillMatrix } from '../entity/englishSkillMatrix.entity';

@EntityRepository(EnglishSkillMatrix)
export class englishSkillMatrixRepository extends Repository<EnglishSkillMatrix> {}
