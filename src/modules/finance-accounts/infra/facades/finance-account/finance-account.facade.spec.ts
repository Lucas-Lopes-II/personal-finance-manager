import {
  FinanceAccountFacade,
  FinanceAccountFacadeDeps,
  FindByIdOutput,
  IFinanceAccountFacade,
} from '@finance-accounts/infra/facades';
import { DefaultUseCase } from '@shared/domain/usecases';
import { randomUUID } from 'node:crypto';

describe('FinanceAccountFacade unit tests', () => {
  let sut: IFinanceAccountFacade;
  let deps: FinanceAccountFacadeDeps;
  let findByIdUsecase: DefaultUseCase;
  const output: FindByIdOutput = {
    id: randomUUID(),
    name: 'name',
    users: [],
    date: new Date().toISOString(),
  };

  beforeEach(() => {
    findByIdUsecase = {
      execute: jest.fn().mockResolvedValue(output),
    } as any as DefaultUseCase;
    deps = {
      findByIdUsecase,
    };
    sut = new FinanceAccountFacade(deps);
  });

  describe('findById', () => {
    it('sholud find an account by id', async () => {
      const result = await sut.findById({ id: output.id });

      expect(result).toStrictEqual(output);
      expect(findByIdUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
