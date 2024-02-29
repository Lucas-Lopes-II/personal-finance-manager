import { IHasher } from '@shared/domain/crypto';
import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/domain/usecases';
import { IUserRepository } from '@users/domain/repositories';

export namespace Signin {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly userRepository: IUserRepository,
      private readonly hasher: IHasher,
    ) {}

    async execute(input: Input): Promise<Output> {
      const user = await this.userRepository.findByEmail(input.email, [
        'id',
        'name',
        'email',
        'password',
      ]);

      if (user) {
        const isPasswordValid = await this.hasher.compare(
          input.password,
          user.password,
        );

        if (isPasswordValid) {
          return {
            id: user['id'],
            name: user['name'],
            email: user['email'],
          };
        }
      }

      throw new BadRequestError('E-mail and/or Password is wrong');
    }
  }
}
