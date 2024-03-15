import {
  IMothlyEntryReport,
  MothlyEntryReportFactory,
} from '@entries/domain/entities';
import { IMothlyEntryReportRepository } from '@entries/domain/repository';
import { IMothlyEntryReportDataGetway } from '@entries/infra/data/getways';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';
import { Month } from '@shared/domain/enums';
import { BadRequestError } from '@shared/domain/errors';

export interface CreateMothlyEntryReportDto {
  month: Month;
  year: number;
  accountId: string;
}

export class CreateMothlyEntryReportService {
  constructor(
    private readonly mothlyEntryReportRepo: IMothlyEntryReportRepository,
    private readonly mothlyEntryReportDataGetway: IMothlyEntryReportDataGetway,
    private readonly financeAccountFacade: IFinanceAccountFacade,
  ) {}

  public async create(
    data: CreateMothlyEntryReportDto,
  ): Promise<IMothlyEntryReport> {
    const account = await this.financeAccountFacade.findById({
      id: data.accountId,
      selectedfields: ['id'],
    });
    if (!account) {
      throw new BadRequestError('account do not exists');
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

    const mothlyEntryReport = MothlyEntryReportFactory.create({
      account: data.accountId,
      month: data.month,
      year: data.year,
    });
    await this.mothlyEntryReportRepo.create(mothlyEntryReport.toJSON());

    return mothlyEntryReport;
  }
}
