import { UserProps } from '@users/domain/entities';
import { IFindById } from '@shared/domain/data-getways';

export interface IUserDataGetway<T = UserProps> extends IFindById<T> {}
