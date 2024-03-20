import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { dataSource } from '@shared/infra/database';
import { UserProps } from '@users/domain/entities';
import { UserEntity } from '@users/infra/data/entities';
import { IUserDataGetway, UserDataGetway } from '@users/infra/data/getways';

describe('UserDataGetway integration tests', () => {
  let sut: IUserDataGetway;
  let userRepo: Repository<UserEntity>;
  const data: UserProps = {
    id: randomUUID(),
    name: 'Name',
    email: 'email@example.com',
    password: 'Test@123',
  };

  beforeAll(async () => {
    try {
      await dataSource.initialize();
      sut = UserDataGetway.createInstance(dataSource);
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

  describe('findById', () => {
    it(`should find an user by id`, async () => {
      await userRepo.save(data);
      const result = await sut.findById(data.id);

      expect(result.id).toStrictEqual(data.id);
      expect(result.name).toStrictEqual('Name');
      expect(result.email).toStrictEqual('email@example.com');
    });

    it(`should find an user by id with select fields`, async () => {
      await userRepo.save(data);
      const result = await sut.findById(data.id, ['name', 'email']);

      expect(result).toEqual({
        name: 'Name',
        email: 'email@example.com',
      });
      expect(result.id).toBeUndefined();
      expect(result.password).toBeUndefined();
    });
  });
});
