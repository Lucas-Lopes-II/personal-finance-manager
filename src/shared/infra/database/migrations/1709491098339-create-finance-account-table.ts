import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFinanceAccountTable1709491098339
  implements MigrationInterface
{
  name = 'CreateFinanceAccountTable1709491098339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "finance-accounts" ("id" uuid NOT NULL, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP DEFAULT now(), "status" character varying, "date" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e3404054390dc01382a52d7c7ab" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "finance-accounts"`);
  }
}
