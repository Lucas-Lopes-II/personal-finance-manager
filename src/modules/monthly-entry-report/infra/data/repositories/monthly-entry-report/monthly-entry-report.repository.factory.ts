import { dataSource } from '@shared/infra/database';
import { IMonthlyEntryReportRepository } from '@monthly-entry-report/domain/repository';
import { MonthlyEntryReportRepository } from '@monthly-entry-report/infra/data/repositories';

export class MonthlyEntryReportRepositoryFactory {
  public static create(): IMonthlyEntryReportRepository {
    return MonthlyEntryReportRepository.createInstance(dataSource);
  }
}
