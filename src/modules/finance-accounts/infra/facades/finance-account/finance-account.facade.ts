import {
  FindByIdInput,
  FindByIdOutput,
  IFinanceAccountFacade,
} from '@finance-accounts/infra/facades';
import { FindFinanceAccountById } from '@finance-accounts/application/usecases';
import { DefaultUseCase } from '@shared/domain/usecases';

export type FinanceAccountFacadeDeps = {
  findByIdUsecase: DefaultUseCase<
    FindFinanceAccountById.Input,
    FindFinanceAccountById.Output
  >;
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
