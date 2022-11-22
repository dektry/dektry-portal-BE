import { MigrationInterface, QueryRunner } from 'typeorm';

export class softAssessmentSuccessfullySavedField1665474157273
  implements MigrationInterface
{
  name = 'softAssessmentSuccessfullySavedField1665474157273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" ADD "successfullySaved" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" DROP COLUMN "successfullySaved"`,
    );
  }
}
