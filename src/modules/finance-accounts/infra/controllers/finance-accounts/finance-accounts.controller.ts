import { AuthRequest } from '@auth/infra/dtos';
import { FinanceAccountUseCasesFactory } from '@finance-accounts/application/usecases';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';

import {
  AddUserInFinanceAccountDTO,
  CreateFinanceAccountDTO,
} from '@finance-accounts/infra/controllers/dtos';
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

  @Put('add-user')
  @HttpCode(HttpStatus.OK)
  public addUser(
    @Body() body: AddUserInFinanceAccountDTO,
    @CurrentUser() { id: actionDoneBy }: AuthRequest,
  ) {
    const usecase = FinanceAccountUseCasesFactory.addUserInFinanceAccount();

    return usecase.execute({ ...body, actionDoneBy });
  }
}
