import { DefaultUseCase } from '@shared/application/usecases';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

export namespace FindFinanceAccountById {
  export type Input = {
    id: string;
    selectedFields: (keyof FinanceAccountProps)[];
  };

  export type Output = FinanceAccountProps | Partial<FinanceAccountProps>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountRepository: IFinanceAccountRepository,
    ) {}

    public async execute({ id, selectedFields }: Input): Promise<Output> {
      return this.financeAccountRepository.findById(id, selectedFields);
    }
  }
}
