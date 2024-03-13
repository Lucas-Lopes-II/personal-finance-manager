import { DefaultUseCase } from '@shared/domain/usecases';
import {
  FindByIdInput,
  FindByIdOutput,
  IFinanceAccountFacade,
} from '@finance-accounts/infra/facades';

export type FinanceAccountFacadeDeps = { findByIdUsecase: DefaultUseCase };

export class FinanceAccountFacade implements IFinanceAccountFacade {
  constructor(private readonly deps: FinanceAccountFacadeDeps) {}

  public async findById(input: FindByIdInput): Promise<FindByIdOutput> {
    const data = await this.deps.findByIdUsecase.execute(input.id);

    return data as FindByIdOutput;
  }
}
