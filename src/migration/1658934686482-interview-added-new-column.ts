import {MigrationInterface, QueryRunner} from "typeorm";

export class interviewAddedNewColumn1658934686482 implements MigrationInterface {
    name = 'interviewAddedNewColumn1658934686482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" ADD "isOffered" boolean`);
        await queryRunner.query(`ALTER TABLE "interview" ADD "comment" character varying(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP COLUMN "isOffered"`);
    }

}
