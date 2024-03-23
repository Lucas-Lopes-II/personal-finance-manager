import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser, IsPublic } from '@shared/infra/decorators';
import { AuthUseCasesFactory } from '@auth/application/usecases';
import { AuthRequest, BecomeAdminUserDTO } from '@auth/infra/dtos';
import { LocalAuthGuard, OnlyAdminGuard } from '@auth/infra/main/guards';

@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  public async login(@Req() req: AuthRequest) {
    const usecase = AuthUseCasesFactory.generateSigninToken();

    return usecase.execute(req.user);
  }

  @Put('become-admin-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OnlyAdminGuard)
  public becomeAdminUser(
    @Body() { userId }: BecomeAdminUserDTO,
    @CurrentUser() { id: actionDoneBy }: AuthRequest,
  ) {
    const usecase = AuthUseCasesFactory.becomeAdminUser();

    return usecase.execute({ userId, actionDoneBy });
  }
}
