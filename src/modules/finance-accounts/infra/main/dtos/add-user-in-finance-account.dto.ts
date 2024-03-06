import { AddUserInFinanceAccount } from '@finance-accounts/application/usecases';

export class AddUserInFinanceAccountDTO
  implements Omit<AddUserInFinanceAccount.Input, 'actionDoneBy'>
{
  accountId: string;
  userId: string;
}
