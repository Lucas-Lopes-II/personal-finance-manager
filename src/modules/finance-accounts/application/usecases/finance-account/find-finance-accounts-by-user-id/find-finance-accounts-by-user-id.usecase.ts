import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { IUserFacade } from '@users/infra/facades';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

export namespace FindFinanceAccountsByUserId {
  export type Input = {
    userId: string;
    selectedFields: (keyof FinanceAccountProps)[];
  };

  export type Output = FinanceAccountProps[] | Partial<FinanceAccountProps>[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountRepository: IFinanceAccountRepository,
      private readonly userFacade: IUserFacade,
    ) {}

    public async execute({ userId, selectedFields }: Input): Promise<Output> {
      const user = await this.userFacade.findById({
        id: userId,
        selectedfields: ['id'],
      });
      if (!user) {
        throw new BadRequestError('user do not exists');
      }

      return this.financeAccountRepository.findByUserId(userId, selectedFields);
    }
  }
}
