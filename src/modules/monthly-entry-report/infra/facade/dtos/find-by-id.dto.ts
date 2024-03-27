import { Month } from '@shared/domain/enums';
import { Summary } from '@monthly-entry-report/domain/entities';

export interface FindByIdInput {
  id: string;
  selectedfields?: (keyof FindByIdOutput)[];
}

export interface FindByIdOutput {
  id?: string;
  month?: Month;
  year?: number;
  account?: string;
  summary?: Summary;
}
