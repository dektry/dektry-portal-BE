import { EntityRepository, Repository } from 'typeorm';
import { SoftSkillMatrix } from '../entity/softSkillMatrix.entity';

@EntityRepository(SoftSkillMatrix)
export class softSkillMatrixRepository extends Repository<SoftSkillMatrix> {}
