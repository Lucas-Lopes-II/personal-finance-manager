import {
  FindByIdInput,
  FindByIdOutput,
} from '@monthly-entry-report/infra/facade';

export interface IMonthlyEntryReportFacade {
  findById(
    input: FindByIdInput,
  ): Promise<FindByIdOutput | Partial<FindByIdOutput>>;
}
