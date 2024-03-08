import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { AuthRequest } from '@auth/infra/dtos';
import { FinanceAccountUseCasesFactory } from '@finance-accounts/application/usecases';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  AddUserInFinanceAccountDTO,
  CreateFinanceAccountDTO,
} from '@finance-accounts/infra/controllers/dtos';
import { CurrentUser } from '@shared/infra/decorators';
import { SelectFields, hydratesSelectFields } from '@shared/infra/dtos';

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

  @Get('')
  @HttpCode(HttpStatus.OK)
  public findByUserId(
    @Query() { selectFields }: SelectFields,
    @CurrentUser() { id: userId }: AuthRequest,
  ) {
    const usecase = FinanceAccountUseCasesFactory.findFinanceAccountsByUserId();

    return usecase.execute({
      selectedFields:
        hydratesSelectFields<keyof FinanceAccountProps>(selectFields),
      userId,
    });
  }
}
