import {MigrationInterface, QueryRunner} from "typeorm";

export class positionAndLevelAddedToSSI1664523723764 implements MigrationInterface {
    name = 'positionAndLevelAddedToSSI1664523723764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD "level_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD "position_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "FK_2a4be46ac29a70481ab14176f92" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "FK_181355e507ca7defd448fc3f8ad" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP CONSTRAINT "FK_181355e507ca7defd448fc3f8ad"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP CONSTRAINT "FK_2a4be46ac29a70481ab14176f92"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP COLUMN "position_id"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP COLUMN "level_id"`);
    }

}
