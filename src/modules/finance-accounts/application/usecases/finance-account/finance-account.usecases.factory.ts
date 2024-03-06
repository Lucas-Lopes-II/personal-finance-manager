import { DefaultUseCase } from '@shared/domain/usecases';
import {
  CreateFinanceAccount,
  AddUserInFinanceAccount,
} from '@finance-accounts/application/usecases';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';
import { IUserRepository } from '@users/domain/repositories';
import { userRepositoryFactory } from '@users/infra/data/repositories';

export class FinanceAccountUseCasesFactory {
  private static readonly financeAccountRepository: IFinanceAccountRepository =
    FinanceAccountRepositoryFactory.create();
  private static readonly userRepository: IUserRepository =
    userRepositoryFactory();

  public static createFinanceAccount(): DefaultUseCase {
    return new CreateFinanceAccount.UseCase(
      this.financeAccountRepository,
      this.userRepository,
    );
  }

  public static addUserInFinanceAccount(): DefaultUseCase {
    return new AddUserInFinanceAccount.UseCase(
      this.financeAccountRepository,
      this.userRepository,
    );
  }
}
