import { FinanceAccountRepository } from '@finance-accounts/infra/data/repositories';
import {
  FinanceAccountEntity,
  FinanceAccountUserEntity,
} from '@finance-accounts/infra/data/entities';
import { dataSource } from '@shared/infra/database';
import { Equal, Repository } from 'typeorm';
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
  let financeAccountUserRepo: Repository<FinanceAccountUserEntity>;
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
      await dataSource.initialize();
      sut = FinanceAccountRepository.createInstance(dataSource);
      FinanceAccountRepo = dataSource.getRepository(FinanceAccountEntity);
      userRepo = dataSource.getRepository(UserEntity);
      financeAccountUserRepo = dataSource.getRepository(
        FinanceAccountUserEntity,
      );
    } catch (error) {
      console.log(error);
    }
  });

  afterEach(async () => {
    await FinanceAccountRepo.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it(`the sut, FinanceAccountRepo and userRepo should be defined`, () => {
    expect(sut).toBeDefined();
    expect(FinanceAccountRepo).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  describe('create', () => {
    it(`should create a FinanceAccount with first FinanceAccountUser`, async () => {
      const createdUser = userRepo.create(userData);
      await userRepo.save(createdUser);

      const input = FinanceAccountFactory.create({
        ...data,
        users: [userData.id],
      });

      await expect(sut.create(input)).resolves.not.toThrow();
    });
  });

  describe('addUserInAccount', () => {
    it(`should add user in FinanceAccount`, async () => {
      const firstUser = userRepo.create({
        id: randomUUID(),
        name: 'Name 1',
        email: 'email@example.com',
        password: 'Test@123',
      });
      const secondUser = userRepo.create({
        id: randomUUID(),
        name: 'Name 2',
        email: 'emai1l@example.com',
        password: 'Test@123',
      });
      await userRepo.save([firstUser, secondUser]);

      const financeAccount = FinanceAccountFactory.create({
        ...data,
        users: [firstUser.id],
      });
      await sut.create(financeAccount);
      financeAccount.addUser(secondUser.id);

      await expect(sut.addUserInAccount(financeAccount)).resolves.not.toThrow();

      const finaceAccountUserList = await financeAccountUserRepo.find({
        select: ['id'],
        where: { financeAccount: Equal(financeAccount.toJSON().id) },
      });

      expect(finaceAccountUserList.length).toStrictEqual(2);
    });
  });

  describe('find', () => {
    it(`should find a FinanceAccount by id`, async () => {
      const createdUser = userRepo.create(userInput);
      await userRepo.save(createdUser);

      const input = FinanceAccountFactory.create({
        ...data,
        users: [userData.id],
      });
      await sut.create(input);

      const result = await sut.find(input.toJSON().id);

      expect(result).toStrictEqual(input);
    });

    it(`should return undefined if do not find a FinanceAccount`, async () => {
      const result = await sut.find('any ID');

      expect(result).toBeUndefined();
    });
  });
});
