import { IUser, UserProps } from '@users/domain/entities';
import { ICreate, IFind, IUpdate } from '@shared/domain/repositories';

export interface IUserRepository<T = IUser>
  extends ICreate<T, T>,
    IFind<string, T>,
    IUpdate<string, UserProps, T> {}
