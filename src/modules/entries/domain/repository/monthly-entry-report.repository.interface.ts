import { ICreate } from '@shared/infra/data-getways';
import { IMonthlyEntryReport } from '@entries/domain/entities';

export interface IMonthlyEntryReportRepository
  extends ICreate<IMonthlyEntryReport, void> {}
