import {MigrationInterface, QueryRunner} from "typeorm";

export class softAssessmentCommentAdded1673438277545 implements MigrationInterface {
    name = 'softAssessmentCommentAdded1673438277545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD "comment" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP COLUMN "comment"`);
    }

}
