import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';
import { E2EUtilities } from '@shared/test';
import { randomUUID } from 'crypto';

export class EntriesE2EUtilities {
  public static async createFinanceAccount(
    users: string[] = [],
  ): Promise<FinanceAccountProps> {
    const user = await E2EUtilities.createUser({
      name: 'name',
      email: `${randomUUID()}@test.com`,
      password: 'Djshjhds@122',
    });
    const financeAccountRepo = FinanceAccountRepositoryFactory.create();
    const data: FinanceAccountProps = {
      id: randomUUID(),
      name: 'test account',
      users: users.length > 0 ? users : [user.id],
      date: new Date().toISOString(),
    };
    await financeAccountRepo.create(FinanceAccountFactory.create(data));

    return data;
  }
}
