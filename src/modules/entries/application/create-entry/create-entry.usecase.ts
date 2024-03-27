import { IEntryRepository } from '@entries/domain/repository';
import { EntryType } from '@entries/domain/enums';
import { DefaultUseCase } from '@shared/application/usecases';
import { BadRequestError } from '@shared/domain/errors';
import { IMonthlyEntryReportFacade } from '@monthly-entry-report/infra/facade';
import { EntryFactory } from '@entries/domain/entities';

export namespace CreateEntry {
  export type Input = {
    description: string;
    executionDate: string;
    type: EntryType;
    value: number;
    monthlyEntryReportId: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly entryReportRepo: IEntryRepository,
      private readonly mothlyEntryReportFacade: IMonthlyEntryReportFacade,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const entry = EntryFactory.create({
        description: input.description,
        executionDate: input.executionDate,
        type: input.type,
        value: input.value,
        monthlyEntryReport: input.monthlyEntryReportId,
      });

      const account = await this.mothlyEntryReportFacade.findById({
        id: entry.monthlyEntryReport,
        selectedfields: ['id'],
      });
      if (!account) {
        throw new BadRequestError('mothlyEntryReport do not exists');
      }

      await this.entryReportRepo.create(entry);
    }
  }
}
