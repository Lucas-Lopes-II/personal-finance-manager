import { ICreate } from '@shared/domain/repositories';
import { MonthlyEntryReportProps } from '@entries/domain/entities';

export interface IMonthlyEntryReportRepository
  extends ICreate<MonthlyEntryReportProps, void> {}
