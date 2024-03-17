import { randomUUID } from 'node:crypto';
import { Month } from '@shared/domain/enums';
import { CreateMothlyEntryReport } from '@entries/application/usecases';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { IMonthlyEntryReportDataGetway } from '@entries/infra/data/getways';
import { IFinanceAccountFacade } from '@finance-accounts/infra/facades';

describe('CreateMothlyEntryReport.UseCase unit tests', () => {
  const mockedInput: CreateMothlyEntryReport.Input = {
    month: Month.JANUARY,
    year: 2023,
    actionDoneBy: randomUUID(),
    accountId: randomUUID(),
  };

  let sut: CreateMothlyEntryReport.UseCase;
  let mockedMothlyEntryReportRepo: IMonthlyEntryReportRepository;
  let mothlyEntryReportDataGetway: IMonthlyEntryReportDataGetway;
  let financeAccountFacade: IFinanceAccountFacade;

  beforeEach(() => {
    mockedMothlyEntryReportRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    } as any as IMonthlyEntryReportRepository;
    financeAccountFacade = {
      findById: jest.fn().mockResolvedValue({
        id: mockedInput.accountId,
        users: [mockedInput.actionDoneBy],
      }),
    } as any as IFinanceAccountFacade;
    mothlyEntryReportDataGetway = {
      findByYearMonthAndAccount: jest.fn().mockResolvedValue(null),
    } as any as IMonthlyEntryReportDataGetway;
    sut = new CreateMothlyEntryReport.UseCase(
      mockedMothlyEntryReportRepo,
      mothlyEntryReportDataGetway,
      financeAccountFacade,
    );
  });

  it('should create a MothlyEntryReport', async () => {
    await expect(sut.execute(mockedInput)).resolves.not.toThrow();
    expect(financeAccountFacade.findById).toHaveBeenCalledTimes(1);
    expect(mockedMothlyEntryReportRepo.create).toHaveBeenCalledTimes(1);
  });
});
