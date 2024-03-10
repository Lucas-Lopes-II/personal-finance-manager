import { IUser, UserProps } from '@users/domain/entities';
import {
  ICreate,
  IEmailExists,
  IFindByEmail,
  IFindById,
  IUpdate,
} from '@shared/domain/repositories';

export interface IUserRepository<T = IUser>
  extends ICreate<T, T>,
    IEmailExists,
    IFindById<UserProps>,
    IUpdate<UserProps, IUser>,
    IFindByEmail<UserProps> {}
