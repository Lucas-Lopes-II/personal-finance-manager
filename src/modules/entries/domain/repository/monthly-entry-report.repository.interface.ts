import { ICreate } from '@shared/domain/data-getways';
import { MonthlyEntryReportProps } from '@entries/domain/entities';

export interface IMonthlyEntryReportRepository
  extends ICreate<MonthlyEntryReportProps, void> {}
