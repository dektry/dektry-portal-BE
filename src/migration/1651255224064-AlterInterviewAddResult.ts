import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterInterviewAddResult1651255224064 implements MigrationInterface {
    name = 'AlterInterviewAddResult1651255224064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" ADD "result" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interview" ADD "level_id" uuid`);
        await queryRunner.query(`ALTER TABLE "interview" ADD "position_id" uuid`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_828ed9f0a2ea760fc7cd920aac8" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_1e4ee1fb601a12705b67e479065" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_1e4ee1fb601a12705b67e479065"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_828ed9f0a2ea760fc7cd920aac8"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP COLUMN "position_id"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP COLUMN "level_id"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP COLUMN "result"`);
    }

}
