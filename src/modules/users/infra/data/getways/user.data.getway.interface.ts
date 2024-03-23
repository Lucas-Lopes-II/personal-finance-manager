import { UserProps } from '@users/domain/entities';
import { IFindById, IFindByEmail } from '@shared/domain/data-getways';

export interface IUserDataGetway<T = UserProps>
  extends IFindById<T>,
    IFindByEmail<T> {}
