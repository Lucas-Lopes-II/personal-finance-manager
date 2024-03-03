import { randomUUID } from 'node:crypto';
import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/domain/usecases';
import { FinanceAccountFactory } from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { IUserRepository } from '@users/domain/repositories';

export namespace CreateFinanceAccount {
  export type Input = {
    name: string;
    date: string;
    userId: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountRepository: IFinanceAccountRepository,
      private readonly userRepository: IUserRepository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const financeAccount = FinanceAccountFactory.create({
        id: randomUUID(),
        date: input.date,
        name: input.name,
        users: [input.userId],
      });

      const user = await this.userRepository.findById(input.userId, ['id']);
      if (!user) {
        throw new BadRequestError('user do not exists');
      }

      await this.financeAccountRepository.create(financeAccount.toJSON());
    }
  }
}
