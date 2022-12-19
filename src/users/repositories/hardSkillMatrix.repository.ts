import { EntityRepository, Repository } from 'typeorm';
import { HardSkillMatrix } from '../entity/hardSkillMatrix.entity';

@EntityRepository(HardSkillMatrix)
export class hardSkillMatrixRepository extends Repository<HardSkillMatrix> {}
