import { Month } from '@shared/domain/enums';
import { DefaultUseCase } from '@shared/domain/usecases';
import { BadRequestError } from '@shared/domain/errors';
import { IMothlyEntryReportRepository } from '@entries/domain/repository';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';
import { MothlyEntryReportFactory } from '@entries/domain/entities';

export namespace CreateMothlyEntryReport {
  export type Input = {
    month: Month;
    year: number;
    accountId: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly mothlyEntryReportRepo: IMothlyEntryReportRepository,
      private readonly financeAccountFacade: IFinanceAccountFacade,
    ) {}

    public async execute({ accountId, month, year }: Input): Promise<Output> {
      const account = await this.financeAccountFacade.findById({
        id: accountId,
        selectedfields: ['id'],
      });
      if (!account) {
        throw new BadRequestError('account do not exists');
      }

      const mothlyEntryReport = MothlyEntryReportFactory.create({
        account: accountId,
        month,
        year,
      });
      await this.mothlyEntryReportRepo.create(mothlyEntryReport.toJSON());
    }
  }
}
