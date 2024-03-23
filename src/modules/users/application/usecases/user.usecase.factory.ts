import { IHasher } from '@shared/domain/crypto';
import { hasherFactory } from '@shared/infra/crypto/hasher';
import {
  IUserDataGetway,
  UserDataGetwayFactory,
} from '@users/infra/data/getways';
import {
  BecomeAdmin,
  CreateUser,
  FindUserById,
  FindUserByEmail,
} from '@users/application/usecases';
import { IUserRepository } from '@users/domain/repositories';
import { userRepositoryFactory } from '@users/infra/data/repositories';

export class UserUseCasesFactory {
  public static readonly repo: IUserRepository = userRepositoryFactory();
  public static readonly hasher: IHasher = hasherFactory();
  public static readonly getway: IUserDataGetway =
    UserDataGetwayFactory.create();

  public static createUser(): CreateUser.UseCase {
    return new CreateUser.UseCase(this.repo, this.hasher);
  }

  public static findUserById(): FindUserById.UseCase {
    return new FindUserById.UseCase(this.getway);
  }

  public static becomeAdmin(): BecomeAdmin.UseCase {
    return new BecomeAdmin.UseCase(this.repo);
  }

  public static findUserByEmail(): FindUserByEmail.UseCase {
    return new FindUserByEmail.UseCase(this.getway);
  }
}
