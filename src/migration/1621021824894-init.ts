import {MigrationInterface, QueryRunner} from "typeorm";

export class init1621021824894 implements MigrationInterface {
    name = 'init1621021824894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("permission" character varying NOT NULL, CONSTRAINT "PK_efcbbce13db89dbd3ef8b7690ae" PRIMARY KEY ("permission"))`);
        await queryRunner.query(`CREATE TABLE "role" ("roleName" character varying NOT NULL, CONSTRAINT "PK_a6142dcc61f5f3fb2d6899fa264" PRIMARY KEY ("roleName"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role" character varying NOT NULL, "permission" character varying NOT NULL, CONSTRAINT "PK_9c116ac03805ca80baf3e8d2319" PRIMARY KEY ("role", "permission"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d5086bd299f773d403574cf1c" ON "role_permissions" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ab5175ebb91e7a07f850acf42" ON "role_permissions" ("permission") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a" FOREIGN KEY ("role") REFERENCES "role"("roleName") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_5d5086bd299f773d403574cf1c8" FOREIGN KEY ("role") REFERENCES "role"("roleName") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e" FOREIGN KEY ("permission") REFERENCES "permissions"("permission") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_5d5086bd299f773d403574cf1c8"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a"`);
        await queryRunner.query(`DROP INDEX "IDX_0ab5175ebb91e7a07f850acf42"`);
        await queryRunner.query(`DROP INDEX "IDX_5d5086bd299f773d403574cf1c"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
