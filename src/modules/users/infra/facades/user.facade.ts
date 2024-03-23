import {
  BecomeAdminInput,
  BecomeAdminOutput,
  FindUserByEmailInput,
  FindUserByEmailOutput,
  FindUserByIdInput,
  FindUserByIdOutput,
  IUserFacade,
} from '@users/infra/facades';
import {
  BecomeAdmin,
  FindUserByEmail,
  FindUserById,
} from '@users/application/usecases';

export type UserFacadeDependencies = {
  findByIdUsecase: FindUserById.UseCase;
  becomeAdminUsecase: BecomeAdmin.UseCase;
  findByEmailUsecase: FindUserByEmail.UseCase;
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

  public async findByEmail(
    input: FindUserByEmailInput,
  ): Promise<FindUserByEmailOutput | Partial<FindUserByEmailOutput>> {
    const { findByEmailUsecase } = this.dependencies;
    const data = await findByEmailUsecase.execute({
      email: input.email,
      selectedfields: input.selectedfields as any,
    });

    return data;
  }
}
