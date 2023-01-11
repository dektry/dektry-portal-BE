import {MigrationInterface, QueryRunner} from "typeorm";

export class typeFieldForSoftAssessment1673448729723 implements MigrationInterface {
    name = 'typeFieldForSoftAssessment1673448729723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD "type" character varying NOT NULL DEFAULT 'Assessment'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP COLUMN "type"`);
    }

}
