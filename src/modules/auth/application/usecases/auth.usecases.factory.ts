import {
  BecomeAdminUser,
  GenerateSigninToken,
  Signin,
} from '@auth/application/usecases';
import { IUserRepository } from '@users/domain/repositories';
import { userRepositoryFactory } from '@users/infra/data/repositories';
import { IHasher } from '@shared/domain/crypto';
import { DefaultUseCase } from '@shared/domain/usecases';
import { hasherFactory } from '@shared/infra/crypto/hasher';
import { IJsonWebToken, JwtFactory } from '@shared/infra/jwt';

export class AuthUseCasesFactory {
  public static readonly userRepo: IUserRepository = userRepositoryFactory();
  public static readonly hasher: IHasher = hasherFactory();
  public static readonly jsonWebToken: IJsonWebToken = JwtFactory.create();

  public static signin(): DefaultUseCase {
    return new Signin.UseCase(this.userRepo, this.hasher);
  }

  public static generateSigninToken(): DefaultUseCase {
    return new GenerateSigninToken.UseCase(this.jsonWebToken);
  }

  public static becomeAdminUser(): DefaultUseCase {
    return new BecomeAdminUser.UseCase(this.userRepo);
  }
}
