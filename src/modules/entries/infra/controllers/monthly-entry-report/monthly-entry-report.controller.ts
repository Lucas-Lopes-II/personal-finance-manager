import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateMonthlyEntryReportDTO } from '@entries/infra/controllers/dtos';
import { MonthlyEntryReportUsecaseFactory } from '@entries/application/usecases/monthly-entry-report/monthly-entry-report.usecase.factory';

@Controller('monthly-entry-reports')
export class MonthlyEntryReportController {
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() body: CreateMonthlyEntryReportDTO) {
    const usecase = MonthlyEntryReportUsecaseFactory.createMothlyEntryReport();

    return usecase.execute({ ...body });
  }
}
