import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFinanceAccountUserPivotTable1709491212641
  implements MigrationInterface
{
  name = 'CreateFinanceAccountUserPivotTable1709491212641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "finance-account-user" ("id" uuid NOT NULL, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP DEFAULT now(), "status" character varying, "userId" uuid, "financeAccountId" uuid, CONSTRAINT "PK_77dcb5141e6b069df98bd7f0312" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance-account-user" ADD CONSTRAINT "FK_f62b26be2839b8567e9ffc53ebf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance-account-user" ADD CONSTRAINT "FK_1b68ae333f5492425309172c284" FOREIGN KEY ("financeAccountId") REFERENCES "finance-accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance-account-user" DROP CONSTRAINT "FK_1b68ae333f5492425309172c284"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance-account-user" DROP CONSTRAINT "FK_f62b26be2839b8567e9ffc53ebf"`,
    );
    await queryRunner.query(`DROP TABLE "finance-account-user"`);
  }
}
