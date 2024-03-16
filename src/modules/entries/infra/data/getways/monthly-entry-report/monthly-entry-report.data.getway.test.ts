import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Month } from '@shared/domain/enums';
import { dataSource } from '@shared/infra/database';
import {
  IMonthlyEntryReportDataGetway,
  MonthlyEntryReportDataGetway,
} from '@entries/infra/data/getways';
import { MonthlyEntryReportProps } from '@entries/domain/entities';
import { MonthlyEntryReportEntity } from '@entries/infra/data/entities';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

describe('MonthlyEntryReportDataGetway integration tests', () => {
  let sut: IMonthlyEntryReportDataGetway;
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
      sut = MonthlyEntryReportDataGetway.createInstance(dataSource);
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

  describe('findByYearMonthAndAccount', () => {
    it(`should find a MonthlyEntryReport by year, month and account`, async () => {
      await financeAccountRepo.create(financeAccountData);
      await monthlyEntryRepo.save(data);
      const result = await sut.findByYearMonthAndAccount(
        data.year,
        data.month,
        data.account,
      );

      expect(result.id).toStrictEqual(data.id);
      expect(result.month).toStrictEqual(data.month);
      expect(result.year).toStrictEqual(data.year);
      expect(result.summary).toStrictEqual(data.summary);
      expect(result.account).toStrictEqual(data.account);
    });

    it(`should find a MonthlyEntryReport by year, month and account with selected fields`, async () => {
      await financeAccountRepo.create(financeAccountData);
      await monthlyEntryRepo.save(data);
      const result = await sut.findByYearMonthAndAccount(
        data.year,
        data.month,
        data.account,
        ['id', 'month', 'year'],
      );

      expect(result.id).toStrictEqual(data.id);
      expect(result.month).toStrictEqual(data.month);
      expect(result.year).toStrictEqual(data.year);
      expect(result.summary).toBeUndefined();
      expect(result.account).toBeUndefined();
    });
  });
});
