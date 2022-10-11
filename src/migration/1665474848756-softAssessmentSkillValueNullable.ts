import {MigrationInterface, QueryRunner} from "typeorm";

export class softAssessmentSkillValueNullable1665474848756 implements MigrationInterface {
    name = 'softAssessmentSkillValueNullable1665474848756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "successfullySaved"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_skill_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_assessment_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "softSkillScoreId"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "softSkillScoreId" character varying`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "comment" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "soft_skill_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "soft_assessment_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "value" character varying`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "value" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568" FOREIGN KEY ("soft_assessment_id") REFERENCES "soft_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question_to_soft_skill" ADD CONSTRAINT "FK_9c5622bd1b0c83ef05da23a8f4b" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill_to_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "soft_skill_question" ADD CONSTRAINT "FK_a176f743828d817ca1103a2236c" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question_to_soft_skill" ADD CONSTRAINT "FK_9c5622bd1b0c83ef05da23a8f4b" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_to_soft_skill" DROP CONSTRAINT "FK_9c5622bd1b0c83ef05da23a8f4b"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_question" DROP CONSTRAINT "FK_a176f743828d817ca1103a2236c"`);
        await queryRunner.query(`ALTER TABLE "question_to_soft_skill" DROP CONSTRAINT "FK_9c5622bd1b0c83ef05da23a8f4b"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "value" character varying`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "value" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_assessment_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_skill_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "softSkillScoreId"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "comment" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "softSkillScoreId" character varying`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "soft_assessment_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "soft_skill_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD "successfullySaved" boolean`);
    }

}
