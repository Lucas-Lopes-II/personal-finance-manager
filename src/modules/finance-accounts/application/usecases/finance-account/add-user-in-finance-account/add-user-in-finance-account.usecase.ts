import { BadRequestError } from '@shared/domain/errors';
import { Validation } from '@shared/domain/validations';
import { DefaultUseCase } from '@shared/application/usecases';
import { IUserFacade } from '@users/infra/facades';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { AddUserInFinanceAccountService } from '@finance-accounts/domain/services';

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
      private readonly userFacade: IUserFacade,
      private readonly validator: Validation,
    ) {}

    public async execute(input: Input): Promise<Output> {
      this.validator.validate(input);
      const newUserToAddExists = await this.userFacade.findById({
        id: input.userId,
        selectedfields: ['id'],
      });
      if (!newUserToAddExists) {
        throw new BadRequestError('User do not exists');
      }

      const addUserInFinanceAccountService = new AddUserInFinanceAccountService(
        this.financeAccountRepository,
      );
      await addUserInFinanceAccountService.add({
        accountId: input.accountId,
        userId: input.userId,
        actionDoneBy: input.actionDoneBy,
      });
    }
  }
}
