import { ICreate } from '@shared/infra/data-getways';
import { MonthlyEntryReportProps } from '@entries/domain/entities';

export interface IMonthlyEntryReportRepository
  extends ICreate<MonthlyEntryReportProps, void> {}
