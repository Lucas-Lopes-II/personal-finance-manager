import {
  FindUserByIdInput,
  FindUserByIdOutput,
  IUserFacade,
} from '@users/infra/facades';
import { FindUserById } from '@users/application/usecases';

export type UserFacadeDeps = {
  findByIdUsecase: FindUserById.UseCase;
};

export class UserFacade implements IUserFacade {
  constructor(private readonly deps: UserFacadeDeps) {}

  public async findById(
    input: FindUserByIdInput,
  ): Promise<FindUserByIdOutput | Partial<FindUserByIdOutput>> {
    const data = await this.deps.findByIdUsecase.execute({
      id: input.id,
      selectedfields: input.selectedfields as any,
    });

    return data;
  }
}
