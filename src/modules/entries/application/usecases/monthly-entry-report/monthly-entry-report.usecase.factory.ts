import { CreateMothlyEntryReport } from '@entries/application/usecases';
import { MonthlyEntryReportDataGetwayFactory } from '@entries/infra/data/getways';
import { MonthlyEntryReportRepositoryFactory } from '@entries/infra/data/repositories';
import { FinanceAccountFacadeFactory } from '@finance-accounts/infra/facades/finance-account/finance-account.facade.factory';

export class MonthlyEntryReportUsecaseFactory {
  private static monthlyEntryReportRepo =
    MonthlyEntryReportRepositoryFactory.create();
  private static monthlyEntryReportGetway =
    MonthlyEntryReportDataGetwayFactory.create();
  private static financeAccountFacade = FinanceAccountFacadeFactory.create();

  public static createMothlyEntryReport(): CreateMothlyEntryReport.UseCase {
    return new CreateMothlyEntryReport.UseCase(
      this.monthlyEntryReportRepo,
      this.monthlyEntryReportGetway,
      this.financeAccountFacade,
    );
  }
}
