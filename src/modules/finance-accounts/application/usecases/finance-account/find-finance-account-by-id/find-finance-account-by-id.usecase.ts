import { DefaultUseCase } from '@shared/application/usecases';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { IFinanceAccountDataGetway } from '@finance-accounts/infra/data/getways';

export namespace FindFinanceAccountById {
  export type Input = {
    id: string;
    selectedFields: (keyof FinanceAccountProps)[];
  };

  export type Output = FinanceAccountProps | Partial<FinanceAccountProps>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountDataGetway: IFinanceAccountDataGetway,
    ) {}

    public async execute({ id, selectedFields }: Input): Promise<Output> {
      return this.financeAccountDataGetway.findById(id, selectedFields);
    }
  }
}
