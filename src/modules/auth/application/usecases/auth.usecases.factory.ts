import { IHasher } from '@shared/domain/crypto';
import { DefaultUseCase } from '@shared/application/usecases';
import { hasherFactory } from '@shared/infra/crypto/hasher';
import { IJsonWebToken, JwtFactory } from '@shared/infra/jwt';
import {
  BecomeAdminUser,
  GenerateSigninToken,
  Signin,
} from '@auth/application/usecases';
import { IUserFacade, UserFacadeFactory } from '@users/infra/facades';

export class AuthUseCasesFactory {
  public static readonly hasher: IHasher = hasherFactory();
  public static readonly jsonWebToken: IJsonWebToken = JwtFactory.create();
  public static readonly userFacade: IUserFacade = UserFacadeFactory.create();

  public static signin(): DefaultUseCase {
    return new Signin.UseCase(this.userFacade, this.hasher);
  }

  public static generateSigninToken(): DefaultUseCase {
    return new GenerateSigninToken.UseCase(this.jsonWebToken);
  }

  public static becomeAdminUser(): DefaultUseCase {
    return new BecomeAdminUser.UseCase(this.userFacade);
  }
}
