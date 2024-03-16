import { DataSource, Repository } from 'typeorm';
import { MonthlyEntryReportProps } from '@entries/domain/entities';
import { MonthlyEntryReportEntity } from '@entries/infra/data/entities';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';

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

  public async create(data: MonthlyEntryReportProps): Promise<void> {
    const createdEntity = this.monthlyEntryReportRepo.create(data);

    await this.monthlyEntryReportRepo.save(createdEntity);
  }
}
