import {MigrationInterface, QueryRunner} from "typeorm";

export class softSkillTableAddNewFields1657799169531 implements MigrationInterface {
    name = 'softSkillTableAddNewFields1657799169531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD "level_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD "position_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_086975e9f8f5399361450ac30a1" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_8351eb293a66c06f3765abf1e9c" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_8351eb293a66c06f3765abf1e9c"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_086975e9f8f5399361450ac30a1"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP COLUMN "position_id"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP COLUMN "level_id"`);
    }

}
