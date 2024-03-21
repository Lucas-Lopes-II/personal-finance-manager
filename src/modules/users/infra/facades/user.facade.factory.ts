import { UserUseCasesFactory } from '@users/application/usecases';
import { UserFacadeDeps, IUserFacade, UserFacade } from '@users/infra/facades';

export class UserFacadeFactory {
  public static create(): IUserFacade {
    const deps: UserFacadeDeps = {
      findByIdUsecase: UserUseCasesFactory.findUserById(),
    };

    return new UserFacade(deps);
  }
}
