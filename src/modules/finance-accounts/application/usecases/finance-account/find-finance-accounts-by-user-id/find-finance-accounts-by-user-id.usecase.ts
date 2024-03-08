import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/domain/usecases';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { IUserRepository } from '@users/domain/repositories';

export namespace FindFinanceAccountsByUserId {
  export type Input = {
    userId: string;
    selectedFields: (keyof FinanceAccountProps)[];
  };

  export type Output = FinanceAccountProps[] | Partial<FinanceAccountProps>[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountRepository: IFinanceAccountRepository,
      private readonly userRepository: IUserRepository,
    ) {}

    public async execute({ userId, selectedFields }: Input): Promise<Output> {
      const user = await this.userRepository.findById(userId, ['id']);
      if (!user) {
        throw new BadRequestError('user do not exists');
      }

      return this.financeAccountRepository.findByUserId(userId, selectedFields);
    }
  }
}
