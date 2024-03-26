import { Column, Entity, Index } from 'typeorm';
import { Month } from '@shared/domain/enums';
import { EntityTypeOrm } from '@shared/infra/database/entities';
import {
  MonthlyEntryReportProps,
  Summary,
} from '@monthly-entry-report/domain/entities';

@Entity('mothly-entry-reports')
export class MonthlyEntryReportEntity
  extends EntityTypeOrm
  implements MonthlyEntryReportProps
{
  @Column({ nullable: false })
  month: Month;

  @Column({ nullable: false })
  year: number;

  @Index()
  @Column({ nullable: false })
  account: string;

  @Column({ nullable: true, type: 'json' })
  summary?: Summary;
}
