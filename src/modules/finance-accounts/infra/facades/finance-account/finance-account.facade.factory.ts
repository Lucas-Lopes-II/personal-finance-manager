import {
  FinanceAccountFacade,
  FinanceAccountFacadeDeps,
  IFinanceAccountFacade,
} from '@finance-accounts/infra/facades';
import { FinanceAccountUseCasesFactory } from '@finance-accounts/application/usecases';

export class FinanceAccountFacadeFactory {
  public static create(): IFinanceAccountFacade {
    const deps: FinanceAccountFacadeDeps = {
      findByIdUsecase: FinanceAccountUseCasesFactory.findFinanceAccountById(),
    };

    return new FinanceAccountFacade(deps);
  }
}
