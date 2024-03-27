import { ICreate, IFind } from '@shared/domain/repositories';
import { IEntry } from '@entries/domain/entities';

export interface IEntryRepository<T = IEntry>
  extends ICreate<T, void>,
    IFind<string, T> {}
