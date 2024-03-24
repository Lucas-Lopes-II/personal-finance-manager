import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { dataSource } from '@shared/infra/database';
import { UserFactory } from '@users/domain/entities';
import { UserEntity } from '@users/infra/data/entities';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import {
  IFinanceAccountDataGetway,
  FinanceAccountDataGetway,
} from '@finance-accounts/infra/data/getways';
import { FinanceAccountEntity } from '@finance-accounts/infra/data/entities';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';

describe('FinanceAccountDataGetway integration tests', () => {
  let sut: IFinanceAccountDataGetway;
  let financeAccountTypeORMRepo: Repository<FinanceAccountEntity>;
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
  const financeAccountRepo = FinanceAccountRepositoryFactory.create();

  beforeAll(async () => {
    try {
      await dataSource.initialize();
      sut = FinanceAccountDataGetway.createInstance(dataSource);
      financeAccountTypeORMRepo =
        dataSource.getRepository(FinanceAccountEntity);
      userRepo = dataSource.getRepository(UserEntity);
    } catch (error) {
      console.log(error);
    }
  });

  afterEach(async () => {
    await financeAccountTypeORMRepo.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it(`the sut, FinanceAccountRepo, financeAccountRepo and userRepo should be defined`, () => {
    expect(sut).toBeDefined();
    expect(financeAccountTypeORMRepo).toBeDefined();
    expect(financeAccountRepo).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  describe('findById', () => {
    it(`should find a FinanceAccount by id`, async () => {
      const createdUser = userRepo.create(userInput);
      await userRepo.save(createdUser);

      const input = FinanceAccountFactory.create({
        ...data,
        users: [userData.id],
      });
      await financeAccountRepo.create(input.toJSON());

      const result = await sut.findById(input.toJSON().id);

      expect(result).toStrictEqual(input.toJSON());
    });

    it(`should find a FinanceAccount by id with selected fields`, async () => {
      const createdUser = userRepo.create(userInput);
      await userRepo.save(createdUser);

      const input = FinanceAccountFactory.create({
        ...data,
        users: [userData.id],
      });
      await financeAccountRepo.create(input.toJSON());

      const result = await sut.findById(input.toJSON().id, ['id', 'name']);

      expect(result).toStrictEqual({
        id: data.id,
        date: undefined,
        name: data.name,
        users: [userInput.id],
      });
    });

    it(`should return undefined if do not find a FinanceAccount`, async () => {
      const result = await sut.findById('any ID');

      expect(result).toBeUndefined();
    });
  });

  describe('findByUserId', () => {
    beforeEach(async () => {
      const createdUser = userRepo.create(userInput);
      await userRepo.save(createdUser);

      const input = FinanceAccountFactory.create({
        ...data,
        users: [userData.id],
      });
      await Promise.all([
        financeAccountRepo.create({ ...input.toJSON(), id: randomUUID() }),
        financeAccountRepo.create({ ...input.toJSON(), id: randomUUID() }),
        financeAccountRepo.create({ ...input.toJSON(), id: randomUUID() }),
      ]);
    });

    it('should return financeAccounts of user', async () => {
      const result = await sut.findByUserId(userData.id);

      expect(result.length).toStrictEqual(3);
    });

    it('should return of financeAccounts of user with selected fields', async () => {
      const result = await sut.findByUserId(userData.id, ['id']);

      expect(result.length).toStrictEqual(3);
      expect(result[0].id).toBeDefined();
      expect(result[0].name).toBeUndefined();
      expect(result[0].date).toBeUndefined();
    });
  });
});
