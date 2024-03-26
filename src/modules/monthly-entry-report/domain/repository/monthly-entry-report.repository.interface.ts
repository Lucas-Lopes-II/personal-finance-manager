import { ICreate } from '@shared/infra/data-getways';
import { IMonthlyEntryReport } from '@monthly-entry-report/domain/entities';

export interface IMonthlyEntryReportRepository
  extends ICreate<IMonthlyEntryReport, void> {}
