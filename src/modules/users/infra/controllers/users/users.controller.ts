import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { hydratesSelectFields } from '@shared/infra/dtos';
import { UserUseCasesFactory } from '@users/application/usecases';

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
}
