import { dataSource } from '@shared/infra/database';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { MonthlyEntryReportRepository } from '@entries/infra/data/repositories';

export class MonthlyEntryReportRepositoryFactory {
  public static create(): IMonthlyEntryReportRepository {
    return MonthlyEntryReportRepository.createInstance(dataSource);
  }
}
