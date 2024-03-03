import { Module } from '@nestjs/common';

import { FinanceAccountsController } from '@finance-accounts/infra/main';

@Module({
  controllers: [FinanceAccountsController],
})
export class FinanceAccountsModule {}
