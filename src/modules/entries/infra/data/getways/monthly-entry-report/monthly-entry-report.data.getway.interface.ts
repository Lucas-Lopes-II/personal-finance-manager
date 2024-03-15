import { Month } from '@shared/domain/enums';
import { MonthlyEntryReportProps } from '@entries/domain/entities';

export interface IMothlyEntryReportDataGetway<T = MonthlyEntryReportProps> {
  findByYearMonthAndAccount(
    year: number,
    month: Month,
    accountId: string,
    selectFields?: (keyof T)[],
  ): Promise<T | Partial<T>>;
}
