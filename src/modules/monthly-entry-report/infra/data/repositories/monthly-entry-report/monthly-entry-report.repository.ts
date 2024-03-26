import { DataSource, Repository } from 'typeorm';
import { IMonthlyEntryReport } from '@monthly-entry-report/domain/entities';
import { MonthlyEntryReportEntity } from '@monthly-entry-report/infra/data/entities';
import { IMonthlyEntryReportRepository } from '@monthly-entry-report/domain/repository';

export class MonthlyEntryReportRepository
  implements IMonthlyEntryReportRepository
{
  public static instance: MonthlyEntryReportRepository | null = null;
  private monthlyEntryReportRepo: Repository<MonthlyEntryReportEntity>;

  private constructor(protected readonly dataSource: DataSource) {
    this.monthlyEntryReportRepo = dataSource.getRepository(
      MonthlyEntryReportEntity,
    );
  }

  public static createInstance(
    dataSource: DataSource,
  ): MonthlyEntryReportRepository {
    if (!MonthlyEntryReportRepository.instance) {
      MonthlyEntryReportRepository.instance = new MonthlyEntryReportRepository(
        dataSource,
      );
    }

    return this.instance;
  }

  public async create(data: IMonthlyEntryReport): Promise<void> {
    const createdEntity = this.monthlyEntryReportRepo.create(data.toJSON());

    await this.monthlyEntryReportRepo.save(createdEntity);
  }
}
