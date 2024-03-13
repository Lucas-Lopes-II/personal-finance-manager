import { ICreate } from '@shared/domain/repositories';
import {
  IMothlyEntryReport,
  MothlyEntryReportProps,
} from '@entries/domain/entities';

export interface IMothlyEntryReportRepository
  extends ICreate<MothlyEntryReportProps, IMothlyEntryReport> {}
