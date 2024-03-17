import { Module } from '@nestjs/common';

import { MonthlyEntryReportController } from '@entries/infra/controllers';

@Module({ controllers: [MonthlyEntryReportController] })
export class EntriesModule {}
