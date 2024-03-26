import { CreateMothlyEntryReport } from '@monthly-entry-report/application/usecases';
import { MonthlyEntryReportDataGetwayFactory } from '@monthly-entry-report/infra/data/getways';
import { MonthlyEntryReportRepositoryFactory } from '@monthly-entry-report/infra/data/repositories';
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
