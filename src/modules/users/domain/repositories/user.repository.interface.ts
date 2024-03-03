import { IUser, UserProps } from '@users/domain/entities';
import {
  ICreate,
  IEmailExists,
  IFindByEmail,
  IFindById,
} from '@shared/domain/repositories';

export interface IUserRepository<T = IUser>
  extends ICreate<T, T>,
    IEmailExists,
    IFindById<UserProps>,
    IFindByEmail<UserProps> {}
