import {MigrationInterface, QueryRunner} from "typeorm";

export class languagesTableCreation1666948487073 implements MigrationInterface {
    name = 'languagesTableCreation1666948487073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "language" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(255), "level" character varying(5), "employee_id" uuid, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9"`);
        await queryRunner.query(`DROP TABLE "language"`);
    }

}
