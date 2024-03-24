import { ICreate, IFind } from '@shared/domain/repositories';
import { IFinanceAccount } from '@finance-accounts/domain/entities';

export interface IFinanceAccountRepository<T = IFinanceAccount>
  extends ICreate<T, void>,
    IAddUserInAccount<T, void>,
    IFind<string, T> {}

interface IAddUserInAccount<D = unknown, T = unknown> {
  addUserInAccount(data: D): Promise<T>;
}
