import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from '@auth/infra/main';
import { UsersModule } from '@users/infra/main';
import { JwtAuthGuard } from '@auth/infra/main/guards';
import { FinanceAccountsModule } from '@finance-accounts/infra/main';
import { MonthlyEntryReportModule } from '@monthly-entry-report/infra/main/monthly-entry-report.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FinanceAccountsModule,
    MonthlyEntryReportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
