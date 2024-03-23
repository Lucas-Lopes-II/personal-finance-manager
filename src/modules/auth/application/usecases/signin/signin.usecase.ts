import { IHasher } from '@shared/domain/crypto';
import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { IUserFacade } from '@users/infra/facades';

export namespace Signin {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    isAdmin: boolean;
    email: string;
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly userFacade: IUserFacade,
      private readonly hasher: IHasher,
    ) {}

    async execute(input: Input): Promise<Output> {
      const user = await this.userFacade.findByEmail({
        email: input.email,
        selectedfields: ['id', 'name', 'email', 'isAdmin', 'password'],
      });

      if (user) {
        const isPasswordValid = await this.hasher.compare(
          input.password,
          user.password,
        );

        if (isPasswordValid) {
          return {
            id: user['id'],
            name: user['name'],
            isAdmin: user['isAdmin'],
            email: user['email'],
          };
        }
      }

      throw new BadRequestError('E-mail and/or Password is wrong');
    }
  }
}
