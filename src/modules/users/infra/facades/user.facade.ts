import {
  BecomeAdminInput,
  BecomeAdminOutput,
  FindUserByIdInput,
  FindUserByIdOutput,
  IUserFacade,
} from '@users/infra/facades';
import { BecomeAdmin, FindUserById } from '@users/application/usecases';

export type UserFacadeDependencies = {
  findByIdUsecase: FindUserById.UseCase;
  becomeAdminUsecase: BecomeAdmin.UseCase;
};

export class UserFacade implements IUserFacade {
  constructor(private readonly dependencies: UserFacadeDependencies) {}

  public async findById(
    input: FindUserByIdInput,
  ): Promise<FindUserByIdOutput | Partial<FindUserByIdOutput>> {
    const { findByIdUsecase } = this.dependencies;
    const data = await findByIdUsecase.execute({
      id: input.id,
      selectedfields: input.selectedfields as any,
    });

    return data;
  }

  public async becomeAdmin(
    input: BecomeAdminInput,
  ): Promise<BecomeAdminOutput> {
    const { becomeAdminUsecase } = this.dependencies;
    const data = await becomeAdminUsecase.execute({
      userId: input.userId,
      actionDoneBy: input.actionDoneBy,
    });

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin,
    };
  }
}
