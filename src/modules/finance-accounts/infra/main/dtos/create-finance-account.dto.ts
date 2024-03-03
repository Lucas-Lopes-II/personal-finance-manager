import { CreateFinanceAccount } from '@finance-accounts/application/usecases';

export class CreateFinanceAccountDTO
  implements Omit<CreateFinanceAccount.Input, 'userId'>
{
  name: string;
  date: string;
}
