import { Month } from '@shared/domain/enums';
import { BadRequestError, ForbiddenError } from '@shared/domain/errors';
import {
  IMonthlyEntryReport,
  MonthlyEntryReportFactory,
} from '@monthly-entry-report/domain/entities';
import { IMonthlyEntryReportRepository } from '@monthly-entry-report/domain/repository';
import { IMonthlyEntryReportDataGetway } from '@monthly-entry-report/infra/data/getways';

export interface CreateMothlyEntryReportDto {
  month: Month;
  year: number;
  actionDoneBy?: string;
  accountData: {
    id: string;
    users: string[];
  };
}

export class CreateMothlyEntryReportService {
  constructor(
    private readonly mothlyEntryReportRepo: IMonthlyEntryReportRepository,
    private readonly mothlyEntryReportDataGetway: IMonthlyEntryReportDataGetway,
  ) {}

  public async create(
    data: CreateMothlyEntryReportDto,
  ): Promise<IMonthlyEntryReport> {
    const actionDoNotDoneByAccountOwner = !data.accountData.users.includes(
      data.actionDoneBy,
    );
    if (actionDoNotDoneByAccountOwner) {
      throw new ForbiddenError('Action not allowed');
    }

    const mothlyEntryWithReportYearMonthAndAccountExists =
      await this.mothlyEntryReportDataGetway.findByYearMonthAndAccount(
        data.year,
        data.month,
        data.accountData.id,
        ['id'],
      );
    if (mothlyEntryWithReportYearMonthAndAccountExists) {
      throw new BadRequestError(
        'There is already a record for this year and month',
      );
    }

    const mothlyEntryReport = MonthlyEntryReportFactory.create({
      account: data.accountData.id,
      month: data.month,
      year: data.year,
    });
    await this.mothlyEntryReportRepo.create(mothlyEntryReport);

    return mothlyEntryReport;
  }
}
