import { MigrationInterface, QueryRunner } from 'typeorm';

export class MonthlyEntryReportTableCreation1710795349153
  implements MigrationInterface
{
  name = 'MonthlyEntryReportTableCreation1710795349153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mothly-entry-reports" ("id" uuid NOT NULL, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP DEFAULT now(), "status" character varying, "month" integer NOT NULL, "year" integer NOT NULL, "account" character varying NOT NULL, "summary" json, CONSTRAINT "PK_9f345647a66716d2ab3df0b6545" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a621d1118c90ccac46130acb07" ON "mothly-entry-reports" ("account") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a621d1118c90ccac46130acb07"`,
    );
    await queryRunner.query(`DROP TABLE "mothly-entry-reports"`);
  }
}
