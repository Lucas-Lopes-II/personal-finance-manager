import { Module } from '@nestjs/common';

import { MonthlyEntryReportController } from '@monthly-entry-report/infra/controllers';

@Module({ controllers: [MonthlyEntryReportController] })
export class MonthlyEntryReportModule {}
