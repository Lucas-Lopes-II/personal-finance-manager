import { IHasher } from '@shared/domain/crypto';
import { ConflictError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { StrongPasswordValidation } from '@shared/domain/validations';
import { UserFactory } from '@users/domain/entities';
import { IUserDataGetway } from '@users/infra/data/getways';
import { IUserRepository } from '@users/domain/repositories';

export namespace CreateUser {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly userRepository: IUserRepository,
      private readonly userDataGetway: IUserDataGetway,
      private readonly hasher: IHasher,
    ) {}

    public async execute({ name, email, password }: Input): Promise<Output> {
      const user = UserFactory.create({
        name,
        email,
      });

      const existsRegistrationWithGivenEmail =
        await this.userDataGetway.findByEmail(user.email, ['id']);
      if (existsRegistrationWithGivenEmail) {
        throw new ConflictError('email already exists');
      }

      const passwordValidator = new StrongPasswordValidation('password');
      passwordValidator.validate({ password });

      const hashedPassword = await this.hasher.hash(password);
      user.changePassword(hashedPassword);

      const savedUser = await this.userRepository.create(user);
      const userData = savedUser.toJSON();

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
      };
    }
  }
}
