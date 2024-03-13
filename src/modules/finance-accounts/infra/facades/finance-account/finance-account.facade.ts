import {
  FindByIdInput,
  FindByIdOutput,
  IFinanceAccountFacade,
} from '@finance-accounts/infra/facades';
import { FindFinanceAccountById } from '@finance-accounts/application/usecases';

export type FinanceAccountFacadeDeps = {
  findByIdUsecase: FindFinanceAccountById.UseCase;
};

export class FinanceAccountFacade implements IFinanceAccountFacade {
  constructor(private readonly deps: FinanceAccountFacadeDeps) {}

  public async findById(
    input: FindByIdInput,
  ): Promise<FindByIdOutput | Partial<FindByIdOutput>> {
    const data = await this.deps.findByIdUsecase.execute({
      id: input.id,
      selectedFields: input.selectedfields,
    });

    return data;
  }
}
