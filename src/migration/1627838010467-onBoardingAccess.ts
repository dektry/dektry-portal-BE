import {MigrationInterface, QueryRunner} from "typeorm";

export class onBoardingAccess1627838010467 implements MigrationInterface {
    name = 'onBoardingAccess1627838010467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_8a974ab8bdb6b87311cd79cb8b3" UNIQUE ("name"), CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "positions" ADD "accessId" uuid`);
        await queryRunner.query(`ALTER TABLE "positionGroup" ADD "accessId" uuid`);
        await queryRunner.query(`ALTER TABLE "positions" ADD CONSTRAINT "FK_a4edd0887ce57867532f5c2914a" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positionGroup" ADD CONSTRAINT "FK_975b9160536723e409e6acd44ca" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "positionGroup" DROP CONSTRAINT "FK_975b9160536723e409e6acd44ca"`);
        await queryRunner.query(`ALTER TABLE "positions" DROP CONSTRAINT "FK_a4edd0887ce57867532f5c2914a"`);
        await queryRunner.query(`ALTER TABLE "positionGroup" DROP COLUMN "accessId"`);
        await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN "accessId"`);
        await queryRunner.query(`DROP TABLE "access"`);
    }

}
