import { randomUUID } from 'node:crypto';
import { Month } from '@shared/domain/enums';
import { BadRequestError } from '@shared/domain/errors';
import {
  CreateMothlyEntryReportDto,
  CreateMothlyEntryReportService,
} from '@entries/domain/services';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { IMothlyEntryReportDataGetway } from '@entries/infra/data/getways';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';

describe('MothlyEntryReportService unit tests', () => {
  const mockedInput: CreateMothlyEntryReportDto = {
    month: Month.JANUARY,
    year: 2023,
    accountId: randomUUID(),
  };

  let sut: CreateMothlyEntryReportService;
  let mockedMothlyEntryReportRepo: IMonthlyEntryReportRepository;
  let mothlyEntryReportDataGetway: IMothlyEntryReportDataGetway;
  let financeAccountFacade: IFinanceAccountFacade;

  beforeEach(() => {
    mockedMothlyEntryReportRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    } as any as IMonthlyEntryReportRepository;
    financeAccountFacade = {
      findById: jest.fn().mockResolvedValue({ id: mockedInput.accountId }),
    } as any as IFinanceAccountFacade;
    mothlyEntryReportDataGetway = {
      findByYearMonthAndAccount: jest.fn().mockResolvedValue(null),
    } as any as IMothlyEntryReportDataGetway;
    sut = new CreateMothlyEntryReportService(
      mockedMothlyEntryReportRepo,
      mothlyEntryReportDataGetway,
      financeAccountFacade,
    );
  });

  it('should create a MothlyEntryReport', async () => {
    const result = await sut.create(mockedInput);

    expect(result.toJSON()).toBeDefined();
    expect(financeAccountFacade.findById).toHaveBeenCalledTimes(1);
    expect(mockedMothlyEntryReportRepo.create).toHaveBeenCalledTimes(1);
    expect(
      mothlyEntryReportDataGetway.findByYearMonthAndAccount,
    ).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if there is no account with given accountId', async () => {
    jest.spyOn(financeAccountFacade, 'findById').mockResolvedValueOnce(null);

    expect(sut.create(mockedInput)).rejects.toThrow(
      new BadRequestError('account do not exists'),
    );
  });

  it('should throw if financeAccountFacade.findById throws', async () => {
    jest.spyOn(financeAccountFacade, 'findById').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.create(mockedInput)).rejects.toThrow();
  });

  it('should throw a BadRequestError if MothlyEntryReport with given year, month and account already exists', async () => {
    jest
      .spyOn(mothlyEntryReportDataGetway, 'findByYearMonthAndAccount')
      .mockResolvedValueOnce({ id: randomUUID() });

    expect(sut.create(mockedInput)).rejects.toThrow(
      new BadRequestError('There is already a record for this year and month'),
    );
  });

  it('should throw if MothlyEntryReportDataGetway.findByYearMonthAndAccount throws', async () => {
    jest
      .spyOn(mothlyEntryReportDataGetway, 'findByYearMonthAndAccount')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.create(mockedInput)).rejects.toThrow();
  });

  it('should throw if MothlyEntryReportRepo.create throws', async () => {
    jest
      .spyOn(mockedMothlyEntryReportRepo, 'create')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.create(mockedInput)).rejects.toThrow();
  });
});
