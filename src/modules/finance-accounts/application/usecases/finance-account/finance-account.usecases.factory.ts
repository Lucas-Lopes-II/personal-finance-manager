import {
  UUIDValidation,
  Validation,
  ValidationComposite,
} from '@shared/domain/validations';
import { DefaultUseCase } from '@shared/application/usecases';
import { IUserFacade, UserFacadeFactory } from '@users/infra/facades';
import {
  FinanceAccountDataGetwayFactory,
  IFinanceAccountDataGetway,
} from '@finance-accounts/infra/data/getways';
import {
  CreateFinanceAccount,
  AddUserInFinanceAccount,
  FindFinanceAccountsByUserId,
  FindFinanceAccountById,
} from '@finance-accounts/application/usecases';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { FinanceAccountRepositoryFactory } from '@finance-accounts/infra/data/repositories';

export class FinanceAccountUseCasesFactory {
  private static readonly financeAccountRepository: IFinanceAccountRepository =
    FinanceAccountRepositoryFactory.create();
  public static readonly userFacade: IUserFacade = UserFacadeFactory.create();
  public static readonly financeAccountDataGetway: IFinanceAccountDataGetway =
    FinanceAccountDataGetwayFactory.create();

  public static createFinanceAccount(): DefaultUseCase<
    CreateFinanceAccount.Input,
    CreateFinanceAccount.Output
  > {
    return new CreateFinanceAccount.UseCase(
      this.financeAccountRepository,
      this.userFacade,
    );
  }

  public static addUserInFinanceAccount(): AddUserInFinanceAccount.UseCase {
    const validations: Validation<AddUserInFinanceAccount.Input>[] = [
      new UUIDValidation('accountId'),
      new UUIDValidation('actionDoneBy'),
      new UUIDValidation('userId'),
    ];
    const validator = new ValidationComposite(validations);

    return new AddUserInFinanceAccount.UseCase(
      this.financeAccountRepository,
      this.userFacade,
      validator,
    );
  }

  public static findFinanceAccountsByUserId(): FindFinanceAccountsByUserId.UseCase {
    return new FindFinanceAccountsByUserId.UseCase(
      this.financeAccountDataGetway,
      this.userFacade,
    );
  }

  public static findFinanceAccountById(): FindFinanceAccountById.UseCase {
    return new FindFinanceAccountById.UseCase(this.financeAccountDataGetway);
  }
}
