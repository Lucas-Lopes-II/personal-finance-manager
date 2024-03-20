import { DefaultUseCase } from '@shared/application/usecases';
import { CreateUser } from '@users/application/usecases';
import { IHasher } from '@shared/domain/crypto';
import { IUserRepository } from '@users/domain/repositories';
import { userRepositoryFactory } from '@users/infra/data/repositories';
import { hasherFactory } from '@shared/infra/crypto/hasher';

export class UserUseCasesFactory {
  public static readonly repo: IUserRepository = userRepositoryFactory();
  public static readonly hasher: IHasher = hasherFactory();

  public static createUser(): DefaultUseCase {
    return new CreateUser.UseCase(this.repo, this.hasher);
  }
}
