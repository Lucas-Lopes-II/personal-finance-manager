import { IFindById, IFindByUserId } from '@shared/infra/data-getways';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';

export interface IFinanceAccountDataGetway<T = FinanceAccountProps>
  extends IFindById<T>,
    IFindByUserId<T> {}
