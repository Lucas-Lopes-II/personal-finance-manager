import { DefaultUseCase } from '@shared/application/usecases';
import { IUserFacade } from '@users/infra/facades';

export namespace BecomeAdminUser {
  export type Input = {
    actionDoneBy: string;
    userId: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userFacade: IUserFacade) {}

    public async execute({ userId, actionDoneBy }: Input): Promise<Output> {
      const updatedUser = await this.userFacade.becomeAdmin({
        actionDoneBy,
        userId,
      });

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      };
    }
  }
}
