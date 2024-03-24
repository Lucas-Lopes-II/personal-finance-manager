import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { IUserRepository } from '@users/domain/repositories';

export namespace BecomeAdmin {
  export type Input = {
    actionDoneBy: string;
    userId: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: IUserRepository) {}

    public async execute({ userId, actionDoneBy }: Input): Promise<Output> {
      const adminUser = await this.userRepository.find(actionDoneBy);
      const user = await this.userRepository.find(userId);
      if (!user) {
        throw new BadRequestError('user do not exists');
      }

      user.becomeAdmin(adminUser);
      await this.userRepository.update(user.id, {
        isAdmin: user.isAdmin,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      };
    }
  }
}
