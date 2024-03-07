import { Module } from '@nestjs/common';

import { FinanceAccountsController } from '../controllers/finance-accounts/finance-accounts.controller';

@Module({
  controllers: [FinanceAccountsController],
})
export class FinanceAccountsModule {}
