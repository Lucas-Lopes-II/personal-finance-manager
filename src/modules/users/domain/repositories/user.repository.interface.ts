import { IUser, UserProps } from '@users/domain/entities';
import { ICreate, IFindById, IUpdate } from '@shared/domain/data-getways';

export interface IUserRepository<T = IUser>
  extends ICreate<T, T>,
    IFindById<UserProps>,
    IUpdate<UserProps, IUser> {}
