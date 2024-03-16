import { dataSource } from '@shared/infra/database';
import {
  IMonthlyEntryReportDataGetway,
  MonthlyEntryReportDataGetway,
} from '@entries/infra/data/getways';

export class MonthlyEntryReportDataGetwayFactory {
  public static create(): IMonthlyEntryReportDataGetway {
    return MonthlyEntryReportDataGetway.createInstance(dataSource);
  }
}
