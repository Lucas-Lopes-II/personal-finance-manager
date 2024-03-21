import {
  FindUserByIdOutput,
  IUserFacade,
  UserFacade,
  UserFacadeDeps,
} from '@users/infra/facades';
import { FindUserById } from '@users/application/usecases';
import { randomUUID } from 'node:crypto';

describe('UserFacade unit tests', () => {
  let sut: IUserFacade;
  let deps: UserFacadeDeps;
  let findByIdUsecase: FindUserById.UseCase;
  const output: FindUserByIdOutput = {
    id: randomUUID(),
    name: 'test',
    email: 'email@email.com',
    isAdmin: true,
  };

  beforeEach(() => {
    findByIdUsecase = {
      execute: jest.fn().mockResolvedValue(output),
    } as any as FindUserById.UseCase;
    deps = {
      findByIdUsecase,
    };
    sut = new UserFacade(deps);
  });

  describe('findById', () => {
    it('sholud find an user by id', async () => {
      const result = await sut.findById({ id: output.id });

      expect(result).toStrictEqual(output);
      expect(findByIdUsecase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw if findByIdUsecase.execute throws', async () => {
      jest.spyOn(findByIdUsecase, 'execute').mockImplementationOnce(() => {
        throw new Error('');
      });

      await expect(sut.findById({ id: output.id })).rejects.toThrow();
    });
  });
});
