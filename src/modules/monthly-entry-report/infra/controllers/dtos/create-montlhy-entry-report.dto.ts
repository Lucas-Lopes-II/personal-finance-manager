import { Month } from '@shared/domain/enums';

export class CreateMonthlyEntryReportDTO {
  month: Month;
  year: number;
  accountId: string;
}
