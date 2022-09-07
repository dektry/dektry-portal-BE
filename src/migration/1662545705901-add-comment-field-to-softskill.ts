import {MigrationInterface, QueryRunner} from "typeorm";

export class addCommentFieldToSoftskill1662545705901 implements MigrationInterface {
    name = 'addCommentFieldToSoftskill1662545705901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" ADD "comment" character varying(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" DROP COLUMN "comment"`);
    }

}
