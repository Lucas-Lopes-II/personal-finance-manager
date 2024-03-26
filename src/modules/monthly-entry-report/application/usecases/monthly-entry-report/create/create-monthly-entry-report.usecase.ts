import { Month } from '@shared/domain/enums';
import { DefaultUseCase } from '@shared/application/usecases';
import { IMonthlyEntryReportRepository } from '@monthly-entry-report/domain/repository';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';
import { IMonthlyEntryReportDataGetway } from '@monthly-entry-report/infra/data/getways';
import { CreateMothlyEntryReportService } from '@monthly-entry-report/domain/services';
import { BadRequestError } from '@shared/domain/errors';

export namespace CreateMothlyEntryReport {
  export type Input = {
    month: Month;
    year: number;
    actionDoneBy: string;
    accountId: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly mothlyEntryReportRepo: IMonthlyEntryReportRepository,
      private readonly mothlyEntryReportDataGetway: IMonthlyEntryReportDataGetway,
      private readonly financeAccountFacade: IFinanceAccountFacade,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const account = await this.financeAccountFacade.findById({
        id: input.accountId,
        selectedfields: ['id'],
      });
      if (!account) {
        throw new BadRequestError('account do not exists');
      }

      const createMothlyEntryReportService = new CreateMothlyEntryReportService(
        this.mothlyEntryReportRepo,
        this.mothlyEntryReportDataGetway,
      );
      await createMothlyEntryReportService.create({
        year: input.year,
        month: input.month,
        accountData: {
          id: account.id,
          users: account.users,
        },
        actionDoneBy: input.actionDoneBy,
      });
    }
  }
}
