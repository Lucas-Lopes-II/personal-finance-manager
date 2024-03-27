import { Month } from '@shared/domain/enums';
import { MonthlyEntryReportProps } from '@monthly-entry-report/domain/entities';
import { IFindById } from '@shared/infra/data-getways';

export interface IMonthlyEntryReportDataGetway<T = MonthlyEntryReportProps>
  extends IFindById<T> {
  findByYearMonthAndAccount(
    year: number,
    month: Month,
    accountId: string,
    selectFields?: (keyof T)[],
  ): Promise<T | Partial<T>>;
}
