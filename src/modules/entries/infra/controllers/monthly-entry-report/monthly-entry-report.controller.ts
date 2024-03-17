import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateMonthlyEntryReportDTO } from '@entries/infra/controllers/dtos';
import { MonthlyEntryReportUsecaseFactory } from '@entries/application/usecases/monthly-entry-report/monthly-entry-report.usecase.factory';
import { CurrentUser } from '@shared/infra/decorators';
import { AuthRequest } from '@auth/infra/dtos';

@Controller('monthly-entry-reports')
export class MonthlyEntryReportController {
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public create(
    @Body() body: CreateMonthlyEntryReportDTO,
    @CurrentUser() { id: actionDoneBy }: AuthRequest,
  ) {
    const usecase = MonthlyEntryReportUsecaseFactory.createMothlyEntryReport();

    return usecase.execute({ ...body, actionDoneBy });
  }
}
