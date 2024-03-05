import { randomUUID } from 'node:crypto';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { BadRequestError } from '@shared/domain/errors';

describe('FinanceAccount unit tests', () => {
  const data: FinanceAccountProps = {
    id: randomUUID(),
    name: 'test',
    users: [randomUUID()],
    date: new Date().toISOString(),
  };

  it('should create a FinanceAccount correctly', () => {
    const financeAccount = FinanceAccountFactory.create(data);
    const result = financeAccount.toJSON();

    expect(financeAccount.id).toStrictEqual(data.id);
    expect(financeAccount.name).toStrictEqual('test');
    expect(financeAccount.users).toStrictEqual(data.users);
    expect(financeAccount.date).toStrictEqual(data.date);
    expect(result).toStrictEqual({
      id: data.id,
      name: 'test',
      users: data.users,
      date: data.date,
    });
  });

  describe('validation', () => {
    it('should throw a BadRequestError if id is invalid', () => {
      const testData = { ...data, id: 'dfcdcfd' };

      expect(() => FinanceAccountFactory.create(testData)).toThrow(
        new BadRequestError('id in invalid format'),
      );
    });

    it('should throw a BadRequestError if one of users is invalid', () => {
      const testData = {
        ...data,
        id: null,
        date: null,
        users: ['dfcdcfd', randomUUID()],
      };

      expect(() => FinanceAccountFactory.create(testData)).toThrow(
        new BadRequestError('users in invalid format'),
      );
    });

    it('should throw a BadRequestError if users list is empty', () => {
      const testData = { ...data, id: null, users: null };

      expect(() => FinanceAccountFactory.create(testData)).toThrow(
        new BadRequestError('users can not be empty'),
      );
    });

    it('should throw a BadRequestError if date is invalid', () => {
      const testData = { ...data, date: 'dfcdcfd' };

      expect(() => FinanceAccountFactory.create(testData)).toThrow(
        new BadRequestError('date in invalid format'),
      );
    });

    it('should throw a BadRequestError if name is in incorrect lenth', () => {
      let testData = { ...data, name: 'd' };

      expect(() => FinanceAccountFactory.create(testData)).toThrow(
        new BadRequestError('name must contain at least 2 characters'),
      );

      testData = { ...data, name: 'dasdfasdfs1'.repeat(10) };

      expect(() => FinanceAccountFactory.create(testData)).toThrow(
        new BadRequestError('name must contain a maximum of 100 characters'),
      );
    });
  });

  describe('addUser', () => {
    it('should add an user in FinanceAccount correctly', () => {
      const financeAccount = FinanceAccountFactory.create({
        ...data,
        users: [randomUUID(), randomUUID()],
      });
      financeAccount.addUser(randomUUID());
      const result = financeAccount.toJSON();

      expect(result).toStrictEqual({
        id: data.id,
        name: 'test',
        users: financeAccount.users,
        date: data.date,
      });
    });

    it('should throw a BadRequestError if user is already added', () => {
      const someUser = randomUUID();
      const financeAccount = FinanceAccountFactory.create({
        ...data,
        users: [someUser, randomUUID()],
      });

      expect(() => financeAccount.addUser(someUser)).toThrow(
        new BadRequestError('this user is already added'),
      );
    });

    it('should throw a BadRequestError if account already has five users', () => {
      const financeAccount = FinanceAccountFactory.create({
        ...data,
        users: [
          randomUUID(),
          randomUUID(),
          randomUUID(),
          randomUUID(),
          randomUUID(),
        ],
      });

      expect(() => financeAccount.addUser(randomUUID())).toThrow(
        new BadRequestError('account should have only five users'),
      );
    });

    it('should throw a BadRequestError if userId is invalid', () => {
      const financeAccount = FinanceAccountFactory.create({
        ...data,
        users: [randomUUID(), randomUUID()],
      });

      expect(() => financeAccount.addUser('worng userId')).toThrow(
        new BadRequestError('user id in invalid format'),
      );
    });
  });
});
