import { BadRequestError, ForbiddenError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { IUserRepository } from '@users/domain/repositories';
import { Validation } from '@shared/domain/validations';

export namespace AddUserInFinanceAccount {
  export type Input = {
    accountId: string;
    userId: string;
    actionDoneBy: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountRepository: IFinanceAccountRepository,
      private readonly userRepository: IUserRepository,
      private readonly validator: Validation,
    ) {}

    public async execute(input: Input): Promise<Output> {
      this.validator.validate(input);
      const { accountId, actionDoneBy, userId } = input;
      const newUserToAddExists = await this.userRepository.findById(userId, [
        'id',
      ]);
      if (!newUserToAddExists) {
        throw new BadRequestError('User do not exists');
      }

      const financeAccountToAddNewUser =
        await this.financeAccountRepository.findById(accountId);
      if (!financeAccountToAddNewUser) {
        throw new BadRequestError('Finance account do not exists');
      }

      const financeAccount = FinanceAccountFactory.create(
        financeAccountToAddNewUser as FinanceAccountProps,
      );

      const userAddingNewUserDoNotBelongToAccount =
        !financeAccount.checkIfUserIsAlreadyAdded(actionDoneBy);
      if (userAddingNewUserDoNotBelongToAccount) {
        throw new ForbiddenError('Action not allowed');
      }

      financeAccount.addUser(userId);
      await this.financeAccountRepository.addUserInAccount(
        financeAccount.toJSON(),
      );
    }
  }
}
