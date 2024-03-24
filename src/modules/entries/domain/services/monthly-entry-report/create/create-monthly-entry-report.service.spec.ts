import { randomUUID } from 'node:crypto';
import { Month } from '@shared/domain/enums';
import { BadRequestError, ForbiddenError } from '@shared/domain/errors';
import {
  CreateMothlyEntryReportDto,
  CreateMothlyEntryReportService,
} from '@entries/domain/services';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { IMonthlyEntryReportDataGetway } from '@entries/infra/data/getways';

describe('MothlyEntryReportService unit tests', () => {
  const actionDoneBy = randomUUID();
  const mockedInput: CreateMothlyEntryReportDto = {
    month: Month.JANUARY,
    year: 2023,
    actionDoneBy,
    accountData: { id: randomUUID(), users: [actionDoneBy] },
  };

  let sut: CreateMothlyEntryReportService;
  let mockedMothlyEntryReportRepo: IMonthlyEntryReportRepository;
  let mothlyEntryReportDataGetway: IMonthlyEntryReportDataGetway;

  beforeEach(() => {
    mockedMothlyEntryReportRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    } as any as IMonthlyEntryReportRepository;

    mothlyEntryReportDataGetway = {
      findByYearMonthAndAccount: jest.fn().mockResolvedValue(null),
    } as any as IMonthlyEntryReportDataGetway;
    sut = new CreateMothlyEntryReportService(
      mockedMothlyEntryReportRepo,
      mothlyEntryReportDataGetway,
    );
  });

  it('should create a MothlyEntryReport', async () => {
    const result = await sut.create(mockedInput);

    expect(result.toJSON()).toBeDefined();
    expect(mockedMothlyEntryReportRepo.create).toHaveBeenCalledTimes(1);
    expect(
      mothlyEntryReportDataGetway.findByYearMonthAndAccount,
    ).toHaveBeenCalledTimes(1);
  });

  it('should throw a ForbiddenError if action do not done by account owner', async () => {
    await expect(
      sut.create({
        ...mockedInput,
        accountData: { ...mockedInput.accountData, users: [randomUUID()] },
      }),
    ).rejects.toThrow(new ForbiddenError('Action not allowed'));
  });

  it('should throw a BadRequestError if MothlyEntryReport with given year, month and account already exists', async () => {
    jest
      .spyOn(mothlyEntryReportDataGetway, 'findByYearMonthAndAccount')
      .mockResolvedValueOnce({ id: randomUUID() });

    await expect(sut.create(mockedInput)).rejects.toThrow(
      new BadRequestError('There is already a record for this year and month'),
    );
  });

  it('should throw if MothlyEntryReportDataGetway.findByYearMonthAndAccount throws', async () => {
    jest
      .spyOn(mothlyEntryReportDataGetway, 'findByYearMonthAndAccount')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    await expect(sut.create(mockedInput)).rejects.toThrow();
  });

  it('should throw if MothlyEntryReportRepo.create throws', async () => {
    jest
      .spyOn(mockedMothlyEntryReportRepo, 'create')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    await expect(sut.create(mockedInput)).rejects.toThrow();
  });
});
