import { BadRequestError, ForbiddenError } from '@shared/domain/errors';
import { FinanceAccountFactory } from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

export type AddUserInFinanceAccountDto = {
  accountId: string;
  userId: string;
  actionDoneBy: string;
};

export class AddUserInFinanceAccountService {
  constructor(
    private readonly financeAccountRepository: IFinanceAccountRepository,
  ) {}

  public async add(data: AddUserInFinanceAccountDto): Promise<void> {
    const financeAccountToAddNewUser = await this.financeAccountRepository.find(
      data.accountId,
    );
    if (!financeAccountToAddNewUser) {
      throw new BadRequestError('Finance account do not exists');
    }

    const financeAccount = FinanceAccountFactory.create(
      financeAccountToAddNewUser,
    );

    const userAddingNewUserDoNotBelongToAccount =
      !financeAccount.checkIfUserIsAlreadyAdded(data.actionDoneBy);
    if (userAddingNewUserDoNotBelongToAccount) {
      throw new ForbiddenError('Action not allowed');
    }

    financeAccount.addUser(data.userId);
    await this.financeAccountRepository.addUserInAccount(financeAccount);
  }
}
