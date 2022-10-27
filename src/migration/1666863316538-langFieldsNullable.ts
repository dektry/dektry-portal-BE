import {MigrationInterface, QueryRunner} from "typeorm";

export class langFieldsNullable1666863316538 implements MigrationInterface {
    name = 'langFieldsNullable1666863316538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "value" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "language" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "language" ADD "code" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "level" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "level" character varying(40)`);
        await queryRunner.query(`CREATE INDEX "IDX_465b3173cdddf0ac2d3fe73a33" ON "language" ("code") `);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "UQ_7032779f9862923a1f4f315b726" UNIQUE ("level", "code")`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9"`);
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "UQ_7032779f9862923a1f4f315b726"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_465b3173cdddf0ac2d3fe73a33"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "level" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "level" character varying(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "value" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
