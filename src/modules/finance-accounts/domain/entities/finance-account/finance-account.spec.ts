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
});
