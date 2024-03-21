import { NotFoundError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { UUIDValidation, Validation } from '@shared/domain/validations';
import { IUserDataGetway } from '@users/infra/data/getways';

export namespace FindUserById {
  export type Input = {
    id: string;
    selectedfields?: (keyof Output)[];
  };

  export type Output = {
    id?: string;
    name?: string;
    email?: string;
    isAdmin?: boolean;
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userGetway: IUserDataGetway) {}

    public async execute(input: Input): Promise<Output> {
      const validator: Validation<Input> = new UUIDValidation('id');
      validator.validate(input);

      const user = await this.userGetway.findById(
        input.id,
        input.selectedfields,
      );
      if (!user) {
        throw new NotFoundError('user not found');
      }

      return {
        id: user?.id || undefined,
        name: user?.name || undefined,
        email: user?.email || undefined,
        isAdmin: typeof user?.isAdmin === 'boolean' ? user?.isAdmin : undefined,
      };
    }
  }
}
