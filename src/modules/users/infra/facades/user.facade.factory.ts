import {
  UserFacadeDependencies,
  IUserFacade,
  UserFacade,
} from '@users/infra/facades';
import { UserUseCasesFactory } from '@users/application/usecases';

export class UserFacadeFactory {
  public static create(): IUserFacade {
    const dependencies: UserFacadeDependencies = {
      findByIdUsecase: UserUseCasesFactory.findUserById(),
      becomeAdminUsecase: UserUseCasesFactory.becomeAdmin(),
    };

    return new UserFacade(dependencies);
  }
}
