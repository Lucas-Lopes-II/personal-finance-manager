import { randomUUID } from 'node:crypto';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';

describe('FinanceAccount unit tests', () => {
  const data: FinanceAccountProps = {
    id: randomUUID(),
    name: 'test',
    users: [],
    date: new Date().toISOString(),
  };

  it('should create a FinanceAccount correctly', () => {
    const financeAccount = FinanceAccountFactory.create(data);

    const result = financeAccount.toJSON();

    expect(financeAccount.id).toStrictEqual(data.id);
    expect(financeAccount.name).toStrictEqual('test');
    expect(financeAccount.users).toStrictEqual([]);
    expect(financeAccount.date).toStrictEqual(data.date);
    expect(result).toStrictEqual({
      id: data.id,
      name: 'test',
      users: [],
      date: data.date,
    });
  });
});
