import { dataSource } from '@shared/infra/database';
import { FinanceAccountRepository } from '@finance-accounts/infra/data/repositories';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

export class FinanceAccountRepositoryFactory {
  public static create(): IFinanceAccountRepository {
    return FinanceAccountRepository.createInstance(dataSource);
  }
}
