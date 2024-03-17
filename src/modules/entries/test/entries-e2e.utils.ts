import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';
import { randomUUID } from 'crypto';

export class EntriesE2EUtilities {
  public static async createFinanceAccount(): Promise<FinanceAccountProps> {
    const financeAccountRepo = FinanceAccountRepositoryFactory.create();
    const data: FinanceAccountProps = {
      id: randomUUID(),
      name: 'test account',
      users: [],
      date: new Date().toISOString(),
    };
    await financeAccountRepo.create(data);

    return data;
  }
}
