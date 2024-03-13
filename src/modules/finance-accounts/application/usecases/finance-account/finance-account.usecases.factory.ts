import {
  UUIDValidation,
  Validation,
  ValidationComposite,
} from '@shared/domain/validations';
import { DefaultUseCase } from '@shared/domain/usecases';
import {
  CreateFinanceAccount,
  AddUserInFinanceAccount,
  FindFinanceAccountsByUserId,
  FindFinanceAccountById,
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

  public static createFinanceAccount(): DefaultUseCase<
    CreateFinanceAccount.Input,
    CreateFinanceAccount.Output
  > {
    return new CreateFinanceAccount.UseCase(
      this.financeAccountRepository,
      this.userRepository,
    );
  }

  public static addUserInFinanceAccount(): DefaultUseCase<
    AddUserInFinanceAccount.Input,
    AddUserInFinanceAccount.Output
  > {
    const validations: Validation<AddUserInFinanceAccount.Input>[] = [
      new UUIDValidation('accountId'),
      new UUIDValidation('actionDoneBy'),
      new UUIDValidation('userId'),
    ];
    const validator = new ValidationComposite(validations);

    return new AddUserInFinanceAccount.UseCase(
      this.financeAccountRepository,
      this.userRepository,
      validator,
    );
  }

  public static findFinanceAccountsByUserId(): DefaultUseCase<
    FindFinanceAccountsByUserId.Input,
    FindFinanceAccountsByUserId.Output
  > {
    return new FindFinanceAccountsByUserId.UseCase(
      this.financeAccountRepository,
      this.userRepository,
    );
  }

  public static findFinanceAccountById(): DefaultUseCase<
    FindFinanceAccountById.Input,
    FindFinanceAccountById.Output
  > {
    return new FindFinanceAccountById.UseCase(this.financeAccountRepository);
  }
}
