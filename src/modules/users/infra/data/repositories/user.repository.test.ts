import { dataSource } from '@shared/infra/database';
import { UserRepository } from './user.repository';
import { IUserRepository } from '@users/domain/repositories';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { UserFactory } from '@users/domain/entities';
import { randomUUID } from 'node:crypto';

describe('UserRepository integration tests', () => {
  let sut: IUserRepository;
  let userRepo: Repository<UserEntity>;
  const id = randomUUID();
  const data = {
    id,
    name: 'Name',
    email: 'email@example.com',
    password: 'Test@123',
  };
  const input = UserFactory.create(data);

  beforeAll(async () => {
    try {
      await dataSource.initialize();
      sut = UserRepository.createInstance(dataSource);
      userRepo = dataSource.getRepository(UserEntity);
    } catch (error) {
      console.log(error);
    }
  });

  afterEach(async () => {
    await userRepo.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it(`the sut and userRepo should be defined`, () => {
    expect(sut).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  describe('create', () => {
    it(`should create an user`, async () => {
      const result = await sut.create(input);

      expect(result.id).toStrictEqual(id);
      expect(result.name).toStrictEqual('Name');
      expect(result.email).toStrictEqual('email@example.com');
      expect(result.isAdmin).toStrictEqual(false);
      expect(result.password).toStrictEqual('Test@123');
    });
  });

  describe('find', () => {
    it(`should find an user`, async () => {
      await sut.create(input);
      const result = await sut.find(data.id);

      expect(result.id).toStrictEqual(id);
      expect(result.name).toStrictEqual('Name');
      expect(result.email).toStrictEqual('email@example.com');
    });
  });

  describe('update', () => {
    it(`should update an user`, async () => {
      await sut.create(input);

      const result = await sut.update(input.id, {
        name: 'Name 1',
        email: 'email1@example.com',
        isAdmin: true,
        password: 'Test1@123',
      });

      expect(result.id).toStrictEqual(id);
      expect(result.name).toStrictEqual('Name 1');
      expect(result.email).toStrictEqual('email1@example.com');
      expect(result.isAdmin).toStrictEqual(true);
      expect(result.password).toStrictEqual('Test1@123');
    });
  });
});
