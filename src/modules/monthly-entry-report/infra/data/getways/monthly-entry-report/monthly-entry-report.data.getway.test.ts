import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Month } from '@shared/domain/enums';
import { dataSource } from '@shared/infra/database';
import {
  IMonthlyEntryReportDataGetway,
  MonthlyEntryReportDataGetway,
} from '@monthly-entry-report/infra/data/getways';
import { MonthlyEntryReportProps } from '@monthly-entry-report/domain/entities';
import { MonthlyEntryReportEntity } from '@monthly-entry-report/infra/data/entities';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';
import { UserEntity } from '@users/infra/data/entities';

describe('MonthlyEntryReportDataGetway integration tests', () => {
  let sut: IMonthlyEntryReportDataGetway;
  let financeAccountRepo: IFinanceAccountRepository;
  let userRepo: Repository<UserEntity>;
  let monthlyEntryRepo: Repository<MonthlyEntryReportEntity>;
  const userData = {
    id: randomUUID(),
    name: 'Name',
    email: 'email@example.com',
    password: 'Test@123',
  };
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
      userRepo = dataSource.getRepository(UserEntity);
      monthlyEntryRepo = dataSource.getRepository(MonthlyEntryReportEntity);
      await userRepo.save(userData);
      await financeAccountRepo.create(
        FinanceAccountFactory.create({
          ...financeAccountData,
          users: [userData.id],
        }),
      );
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

  describe('findById', () => {
    it(`should find a MonthlyEntryReport by id`, async () => {
      await monthlyEntryRepo.save(data);
      const result = await sut.findById(data.id);

      expect({ ...result }).toStrictEqual(data);
    });

    it(`should find a MonthlyEntryReport by id with select fields`, async () => {
      await monthlyEntryRepo.save(data);
      const result = await sut.findById(data.id, ['id', 'month']);

      expect({ ...result }).toEqual({
        id: data.id,
        month: data.month,
      });
      expect(result.account).toBeUndefined();
      expect(result.summary).toBeUndefined();
      expect(result.year).toBeUndefined();
    });
  });
});
