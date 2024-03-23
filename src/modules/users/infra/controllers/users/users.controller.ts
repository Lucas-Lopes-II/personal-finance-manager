import { OnlyAdminGuard } from '@auth/infra/main/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { hydratesSelectFields } from '@shared/infra/dtos';
import { UserUseCasesFactory } from '@users/application/usecases';
import { CreateUserDTO } from '@users/infra/controllers/dtos';

@Controller('users')
export class UsersController {
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findById(
    @Param('id') id: string,
    @Query() { selectFields }: { selectFields: string },
  ) {
    const usecase = UserUseCasesFactory.findUserById();

    return usecase.execute({
      id,
      selectedfields: hydratesSelectFields(selectFields) as any,
    });
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OnlyAdminGuard)
  public create(@Body() body: CreateUserDTO) {
    const usecase = UserUseCasesFactory.createUser();

    return usecase.execute(body);
  }
}
