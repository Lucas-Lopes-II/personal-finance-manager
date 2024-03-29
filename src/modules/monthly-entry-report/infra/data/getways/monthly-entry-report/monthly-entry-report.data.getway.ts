import { DataSource, Equal, Repository } from 'typeorm';
import { Month } from '@shared/domain/enums';
import { DatabaseUtils } from '@shared/infra/database';
import { MonthlyEntryReportProps } from '@monthly-entry-report/domain/entities';
import { MonthlyEntryReportEntity } from '@monthly-entry-report/infra/data/entities';
import { IMonthlyEntryReportDataGetway } from '@monthly-entry-report/infra/data/getways';

export class MonthlyEntryReportDataGetway
  extends DatabaseUtils<MonthlyEntryReportProps>
  implements IMonthlyEntryReportDataGetway
{
  public static instance: MonthlyEntryReportDataGetway | null = null;
  public monthlyEntryReportRepo: Repository<MonthlyEntryReportEntity>;
  protected allowedFields: (keyof MonthlyEntryReportProps)[] = [
    'id',
    'month',
    'year',
    'summary',
    'summary',
  ];

  private constructor(protected readonly dataSource: DataSource) {
    super();
    this.monthlyEntryReportRepo = dataSource.getRepository(
      MonthlyEntryReportEntity,
    );
  }

  public static createInstance(
    dataSource: DataSource,
  ): MonthlyEntryReportDataGetway {
    if (!MonthlyEntryReportDataGetway.instance) {
      MonthlyEntryReportDataGetway.instance = new MonthlyEntryReportDataGetway(
        dataSource,
      );
    }

    return this.instance;
  }

  public async findByYearMonthAndAccount(
    year: number,
    month: Month,
    accountId: string,
    selectFields: (keyof MonthlyEntryReportProps)[] = [],
  ): Promise<MonthlyEntryReportProps | Partial<MonthlyEntryReportProps>> {
    const select = this.createQueryBuilderSelectByFields(
      'monthlyEntryReportEntity',
      selectFields,
    );

    const data = await this.monthlyEntryReportRepo
      .createQueryBuilder('monthlyEntryReportEntity')
      .select(select)
      .where('monthlyEntryReportEntity.year = :year', {
        year,
      })
      .andWhere('monthlyEntryReportEntity.month = :month', {
        month,
      })
      .andWhere('monthlyEntryReportEntity.account = :accountId', {
        accountId,
      })
      .getOne();

    return data;
  }

  public async findById(
    id: string,
    fields: (keyof MonthlyEntryReportProps)[] = [],
  ): Promise<MonthlyEntryReportProps | Partial<MonthlyEntryReportProps>> {
    const select = this.createSelectByFields(fields);

    return this.monthlyEntryReportRepo.findOne({
      select,
      where: { id: Equal(id) },
    });
  }
}
