import {
  IAddUserInAccount,
  ICreate,
  IFindById,
  IFindByUserId,
} from '@shared/infra/data-getways';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';

export interface IFinanceAccountRepository<T = FinanceAccountProps>
  extends ICreate<T, void>,
    IAddUserInAccount<T, void>,
    IFindById<T>,
    IFindByUserId<T> {}
