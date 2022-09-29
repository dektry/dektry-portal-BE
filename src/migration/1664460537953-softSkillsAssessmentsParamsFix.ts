import {MigrationInterface, QueryRunner} from "typeorm";

export class softSkillsAssessmentsParamsFix1664460537953 implements MigrationInterface {
    name = 'softSkillsAssessmentsParamsFix1664460537953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
