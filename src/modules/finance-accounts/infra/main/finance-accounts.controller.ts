import { AuthRequest } from '@auth/infra/main/dtos';
import { FinanceAccountUseCasesFactory } from '@finance-accounts/application/usecases/finance-account/finance-account.usecases.factory';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateFinanceAccountDTO } from '@finance-accounts/infra/main/dtos';
import { CurrentUser } from '@shared/infra/decorators';

@Controller('finance-accounts')
export class FinanceAccountsController {
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public create(
    @Body() body: CreateFinanceAccountDTO,
    @CurrentUser() { id: userId }: AuthRequest,
  ) {
    const usecase = FinanceAccountUseCasesFactory.createFinanceAccount();

    return usecase.execute({ ...body, userId });
  }
}
