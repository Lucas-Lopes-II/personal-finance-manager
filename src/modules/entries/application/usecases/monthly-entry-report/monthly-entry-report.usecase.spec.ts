import { randomUUID } from 'node:crypto';
import { Month } from '@shared/domain/enums';
import { BadRequestError } from '@shared/domain/errors';
import { CreateMothlyEntryReport } from '@entries/application/usecases';
import { IMothlyEntryReportRepository } from '@entries/domain/repository';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';

describe('CreateMothlyEntryReport.UseCase unit tests', () => {
  const mockedInput: CreateMothlyEntryReport.Input = {
    month: Month.JANUARY,
    year: 2023,
    accountId: randomUUID(),
  };

  let sut: CreateMothlyEntryReport.UseCase;
  let mockedMothlyEntryReportRepo: IMothlyEntryReportRepository;
  let financeAccountFacade: IFinanceAccountFacade;

  beforeEach(() => {
    mockedMothlyEntryReportRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    } as any as IMothlyEntryReportRepository;
    financeAccountFacade = {
      findById: jest.fn().mockResolvedValue({ id: mockedInput.accountId }),
    } as any as IFinanceAccountFacade;
    sut = new CreateMothlyEntryReport.UseCase(
      mockedMothlyEntryReportRepo,
      financeAccountFacade,
    );
  });

  it('should create a MothlyEntryReport', async () => {
    await expect(sut.execute(mockedInput)).resolves.not.toThrow();
    expect(financeAccountFacade.findById).toHaveBeenCalledTimes(1);
    expect(mockedMothlyEntryReportRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if there is no account with given accountId', async () => {
    jest.spyOn(financeAccountFacade, 'findById').mockResolvedValueOnce(null);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('account do not exists'),
    );
  });

  it('should throw if financeAccountFacade.findById throws', async () => {
    jest.spyOn(financeAccountFacade, 'findById').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if MothlyEntryReportRepo.create throws', async () => {
    jest
      .spyOn(mockedMothlyEntryReportRepo, 'create')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
