import {
  IAddUserInAccount,
  ICreate,
  IFindById,
  IFindByUserId,
} from '@shared/domain/repositories';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';

export interface IFinanceAccountRepository<T = FinanceAccountProps>
  extends ICreate<T, void>,
    IAddUserInAccount<T, void>,
    IFindById<T>,
    IFindByUserId<T> {}
