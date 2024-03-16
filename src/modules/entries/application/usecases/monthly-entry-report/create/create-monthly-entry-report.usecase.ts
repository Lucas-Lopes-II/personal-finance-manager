import { Month } from '@shared/domain/enums';
import { DefaultUseCase } from '@shared/domain/usecases';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';
import { IMonthlyEntryReportDataGetway } from '@entries/infra/data/getways';
import { CreateMothlyEntryReportService } from '@entries/domain/services';

export namespace CreateMothlyEntryReport {
  export type Input = {
    month: Month;
    year: number;
    accountId: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly mothlyEntryReportRepo: IMonthlyEntryReportRepository,
      private readonly mothlyEntryReportDataGetway: IMonthlyEntryReportDataGetway,
      private readonly financeAccountFacade: IFinanceAccountFacade,
    ) {}

    public async execute({ accountId, month, year }: Input): Promise<Output> {
      const createMothlyEntryReportService = new CreateMothlyEntryReportService(
        this.mothlyEntryReportRepo,
        this.mothlyEntryReportDataGetway,
        this.financeAccountFacade,
      );
      await createMothlyEntryReportService.create({ year, month, accountId });
    }
  }
}
