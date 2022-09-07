import {MigrationInterface, QueryRunner} from "typeorm";

export class addSoftSkillScoreIdFieldToSoftskills1662559555987 implements MigrationInterface {
    name = 'addSoftSkillScoreIdFieldToSoftskills1662559555987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" RENAME COLUMN "isActive" TO "softSkillScoreId"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" DROP COLUMN "softSkillScoreId"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" ADD "softSkillScoreId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" DROP COLUMN "softSkillScoreId"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" ADD "softSkillScoreId" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" RENAME COLUMN "softSkillScoreId" TO "isActive"`);
    }

}
