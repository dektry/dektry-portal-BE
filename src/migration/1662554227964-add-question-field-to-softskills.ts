import {MigrationInterface, QueryRunner} from "typeorm";

export class addQuestionFieldToSoftskills1662554227964 implements MigrationInterface {
    name = 'addQuestionFieldToSoftskills1662554227964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill" ADD "question" character varying(512) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill" DROP COLUMN "question"`);
    }

}
