import {MigrationInterface, QueryRunner} from "typeorm";

export class articles1627566837112 implements MigrationInterface {
    name = 'articles1627566837112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "create_at" TIMESTAMP NOT NULL, "update_at" TIMESTAMP NOT NULL, CONSTRAINT "UQ_3c28437db9b5137136e1f6d6096" UNIQUE ("title"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles_read_positions_positions" ("articlesId" uuid NOT NULL, "positionsId" uuid NOT NULL, CONSTRAINT "PK_743e09fd55d06405c9d805ef9e6" PRIMARY KEY ("articlesId", "positionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_700a7215c0181c27c1aeefa11f" ON "articles_read_positions_positions" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_05fbb911cdec42252d5929e081" ON "articles_read_positions_positions" ("positionsId") `);
        await queryRunner.query(`CREATE TABLE "articles_edit_positions_positions" ("articlesId" uuid NOT NULL, "positionsId" uuid NOT NULL, CONSTRAINT "PK_1e097574582c33f203c913b0461" PRIMARY KEY ("articlesId", "positionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f25d8c2f86b085054870e7850d" ON "articles_edit_positions_positions" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_795cd98080b7f5ee3eb477cda9" ON "articles_edit_positions_positions" ("positionsId") `);
        await queryRunner.query(`ALTER TABLE "articles_read_positions_positions" ADD CONSTRAINT "FK_700a7215c0181c27c1aeefa11f3" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "articles_read_positions_positions" ADD CONSTRAINT "FK_05fbb911cdec42252d5929e081c" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "articles_edit_positions_positions" ADD CONSTRAINT "FK_f25d8c2f86b085054870e7850d1" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "articles_edit_positions_positions" ADD CONSTRAINT "FK_795cd98080b7f5ee3eb477cda9b" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles_edit_positions_positions" DROP CONSTRAINT "FK_795cd98080b7f5ee3eb477cda9b"`);
        await queryRunner.query(`ALTER TABLE "articles_edit_positions_positions" DROP CONSTRAINT "FK_f25d8c2f86b085054870e7850d1"`);
        await queryRunner.query(`ALTER TABLE "articles_read_positions_positions" DROP CONSTRAINT "FK_05fbb911cdec42252d5929e081c"`);
        await queryRunner.query(`ALTER TABLE "articles_read_positions_positions" DROP CONSTRAINT "FK_700a7215c0181c27c1aeefa11f3"`);
        await queryRunner.query(`DROP INDEX "IDX_795cd98080b7f5ee3eb477cda9"`);
        await queryRunner.query(`DROP INDEX "IDX_f25d8c2f86b085054870e7850d"`);
        await queryRunner.query(`DROP TABLE "articles_edit_positions_positions"`);
        await queryRunner.query(`DROP INDEX "IDX_05fbb911cdec42252d5929e081"`);
        await queryRunner.query(`DROP INDEX "IDX_700a7215c0181c27c1aeefa11f"`);
        await queryRunner.query(`DROP TABLE "articles_read_positions_positions"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
