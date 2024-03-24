import { BadRequestError } from '@shared/domain/errors';
import { DefaultUseCase } from '@shared/application/usecases';
import { IUserFacade } from '@users/infra/facades';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { IFinanceAccountDataGetway } from '@finance-accounts/infra/data/getways';

export namespace FindFinanceAccountsByUserId {
  export type Input = {
    userId: string;
    selectedFields: (keyof FinanceAccountProps)[];
  };

  export type Output = FinanceAccountProps[] | Partial<FinanceAccountProps>[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly financeAccountDataGetway: IFinanceAccountDataGetway,
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

      return this.financeAccountDataGetway.findByUserId(userId, selectedFields);
    }
  }
}
