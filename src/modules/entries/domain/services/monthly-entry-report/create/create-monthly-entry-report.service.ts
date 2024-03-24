import {
  IMonthlyEntryReport,
  MonthlyEntryReportFactory,
} from '@entries/domain/entities';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { IMonthlyEntryReportDataGetway } from '@entries/infra/data/getways';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';
import { Month } from '@shared/domain/enums';
import { BadRequestError, ForbiddenError } from '@shared/domain/errors';

export interface CreateMothlyEntryReportDto {
  month: Month;
  year: number;
  actionDoneBy?: string;
  accountId: string;
}

export class CreateMothlyEntryReportService {
  constructor(
    private readonly mothlyEntryReportRepo: IMonthlyEntryReportRepository,
    private readonly mothlyEntryReportDataGetway: IMonthlyEntryReportDataGetway,
    private readonly financeAccountFacade: IFinanceAccountFacade,
  ) {}

  public async create(
    data: CreateMothlyEntryReportDto,
  ): Promise<IMonthlyEntryReport> {
    const account = await this.financeAccountFacade.findById({
      id: data.accountId,
      selectedfields: ['id'],
    });
    if (!account) {
      throw new BadRequestError('account do not exists');
    }

    const actionDoNotDoneByAccountOwner = !account.users.includes(
      data.actionDoneBy,
    );
    if (actionDoNotDoneByAccountOwner) {
      throw new ForbiddenError('Action not allowed');
    }

    const mothlyEntryWithReportYearMonthAndAccountExists =
      await this.mothlyEntryReportDataGetway.findByYearMonthAndAccount(
        data.year,
        data.month,
        data.accountId,
        ['id'],
      );
    if (mothlyEntryWithReportYearMonthAndAccountExists) {
      throw new BadRequestError(
        'There is already a record for this year and month',
      );
    }

    const mothlyEntryReport = MonthlyEntryReportFactory.create({
      account: data.accountId,
      month: data.month,
      year: data.year,
    });
    await this.mothlyEntryReportRepo.create(mothlyEntryReport);

    return mothlyEntryReport;
  }
}
