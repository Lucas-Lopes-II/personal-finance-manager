import { FinanceAccountRepository } from '@finance-accounts/infra/data/repositories';
import { FinanceAccountEntity } from '@finance-accounts/infra/data/entities';
import { dataSourceTest } from '@shared/infra/database';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { UserEntity } from '@users/infra/data/entities';
import { UserFactory } from '@users/domain/entities';

describe('FinanceAccountRepository integration tests', () => {
  let sut: IFinanceAccountRepository;
  let FinanceAccountRepo: Repository<FinanceAccountEntity>;
  let userRepo: Repository<UserEntity>;
  const data: FinanceAccountProps = {
    id: randomUUID(),
    name: 'Name',
    date: new Date().toISOString(),
    users: [],
  };

  const userData = {
    id: randomUUID(),
    name: 'Name',
    email: 'email@example.com',
    password: 'Test@123',
  };
  const userInput = UserFactory.create(userData);

  beforeAll(async () => {
    try {
      await dataSourceTest.initialize();
      sut = FinanceAccountRepository.createInstance(dataSourceTest);
      FinanceAccountRepo = dataSourceTest.getRepository(FinanceAccountEntity);
      userRepo = dataSourceTest.getRepository(UserEntity);
    } catch (error) {
      console.log(error);
    }
  });

  afterEach(async () => {
    await FinanceAccountRepo.clear();
  });

  afterAll(async () => {
    await dataSourceTest.destroy();
  });

  it(`the sut, FinanceAccountRepo and userRepo should be defined`, () => {
    expect(sut).toBeDefined();
    expect(FinanceAccountRepo).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  describe('create', () => {
    it(`should create a FinanceAccount with first FinanceAccountUser`, async () => {
      const createdUser = userRepo.create(userInput);
      await userRepo.save(createdUser);

      const input = FinanceAccountFactory.create({
        ...data,
        users: [userData.id],
      });

      await expect(sut.create(input.toJSON())).resolves.not.toThrow();
    });
  });
});
