import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { UserFactory, UserProps } from '@users/domain/entities';
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
      const adminUser = await this.userRepository.findById(actionDoneBy);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new BadRequestError('user do not exists');
      }

      const updatedUser = await this.userRepository.update(userId, {
        isAdmin: true,
      });
      updatedUser.becomeAdmin(UserFactory.create(adminUser as UserProps));

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      };
    }
  }
}
