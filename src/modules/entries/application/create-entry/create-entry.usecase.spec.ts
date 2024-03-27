import { randomUUID } from 'node:crypto';
import { BadRequestError } from '@shared/domain/errors';
import { IMonthlyEntryReportFacade } from '@monthly-entry-report/infra/facade';
import { EntryType } from '@entries/domain/enums';
import { EntryFactory } from '@entries/domain/entities';
import { IEntryRepository } from '@entries/domain/repository';
import { CreateEntry } from './create-entry.usecase';

describe('CreateEntry.UseCase unit tests', () => {
  let sut: CreateEntry.UseCase;
  let mockedRepository: IEntryRepository;
  let mockedMonthlyEntryReportFacade: IMonthlyEntryReportFacade;

  const mockedInput: CreateEntry.Input = {
    description: 'teste',
    executionDate: new Date().toISOString(),
    type: EntryType.INVESTMENT,
    value: 15.56,
    monthlyEntryReportId: randomUUID(),
  };
  const createdEntry = EntryFactory.create({
    ...mockedInput,
    monthlyEntryReport: mockedInput.monthlyEntryReportId,
  });

  beforeEach(() => {
    mockedRepository = {
      create: jest.fn().mockResolvedValue(createdEntry),
    } as any as IEntryRepository;
    mockedMonthlyEntryReportFacade = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: createdEntry.monthlyEntryReport }),
    } as any as IMonthlyEntryReportFacade;

    sut = new CreateEntry.UseCase(
      mockedRepository,
      mockedMonthlyEntryReportFacade,
    );
  });

  it('The mockedRepository, mockedMonthlyEntryReportFacade and sut should be defined', () => {
    expect(mockedRepository).toBeDefined();
    expect(mockedMonthlyEntryReportFacade).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should create an Entry correctly', async () => {
    await expect(sut.execute(mockedInput)).resolves.not.toThrow();
  });

  it('should throw a BadRequestError if there is no monthlyEntryReport with given monthlyEntryReportId', async () => {
    jest
      .spyOn(mockedMonthlyEntryReportFacade, 'findById')
      .mockResolvedValueOnce(null);

    await expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('mothlyEntryReport do not exists'),
    );
  });

  it('should throw if MonthlyEntryReportFacade.findById throws', async () => {
    jest
      .spyOn(mockedMonthlyEntryReportFacade, 'findById')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    await expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if Repository.findById throws', async () => {
    jest.spyOn(mockedRepository, 'create').mockImplementationOnce(() => {
      throw new Error('');
    });

    await expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
