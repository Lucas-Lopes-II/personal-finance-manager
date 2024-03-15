import { Month } from '@shared/domain/enums';
import { MothlyEntryReportProps } from '@entries/domain/entities';

export interface IMothlyEntryReportDataGetway<T = MothlyEntryReportProps> {
  findByYearMonthAndAccount(
    year: number,
    month: Month,
    accountId: string,
    selectFields?: (keyof T)[],
  ): Promise<T | Partial<T>>;
}
