import { ICreate } from '@shared/domain/repositories';
import {
  IMonthlyEntryReport,
  MonthlyEntryReportProps,
} from '@entries/domain/entities';

export interface IMothlyEntryReportRepository
  extends ICreate<MonthlyEntryReportProps, IMonthlyEntryReport> {}
