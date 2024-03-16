import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Month } from '@shared/domain/enums';
import { dataSource } from '@shared/infra/database';
import { MonthlyEntryReportProps } from '@entries/domain/entities';
import { MonthlyEntryReportEntity } from '@entries/infra/data/entities';
import { IMonthlyEntryReportRepository } from '@entries/domain/repository';
import { MonthlyEntryReportRepository } from '@entries/infra/data/repositories';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';

describe('MonthlyEntryReportRepository integration tests', () => {
  let sut: IMonthlyEntryReportRepository;
  let financeAccountRepo: IFinanceAccountRepository;
  let monthlyEntryRepo: Repository<MonthlyEntryReportEntity>;
  const financeAccountData: FinanceAccountProps = {
    id: randomUUID(),
    name: 'Name',
    date: new Date().toISOString(),
    users: [],
  };
  const data: MonthlyEntryReportProps = {
    id: randomUUID(),
    month: Month.AUGUST,
    year: 2023,
    account: financeAccountData.id,
    summary: [{ categoryName: 'Financeiro', total: 1500 }],
  };

  beforeAll(async () => {
    try {
      await dataSource.initialize();
      sut = MonthlyEntryReportRepository.createInstance(dataSource);
      financeAccountRepo = FinanceAccountRepositoryFactory.create();
      monthlyEntryRepo = dataSource.getRepository(MonthlyEntryReportEntity);
    } catch (error) {
      console.log(error);
    }
  });

  afterEach(async () => {
    await monthlyEntryRepo.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it(`the sut and FinanceAccountRepo should be defined`, () => {
    expect(sut).toBeDefined();
    expect(financeAccountRepo).toBeDefined();
  });

  describe('create', () => {
    it(`should create a MonthlyEntryReport`, async () => {
      await financeAccountRepo.create(financeAccountData);

      await expect(sut.create(data)).resolves.not.toThrow();
    });
  });
});
