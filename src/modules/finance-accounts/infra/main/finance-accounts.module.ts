import { Module } from '@nestjs/common';

import { FinanceAccountsController } from './finance-accounts.controller';

@Module({
  controllers: [FinanceAccountsController],
})
export class FinanceAccountsModule {}
