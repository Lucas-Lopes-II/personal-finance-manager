import {
  FindUserByIdOutput,
  BecomeAdminOutput,
  IUserFacade,
  UserFacade,
  UserFacadeDependencies,
  FindUserByEmailOutput,
} from '@users/infra/facades';
import {
  BecomeAdmin,
  FindUserByEmail,
  FindUserById,
} from '@users/application/usecases';
import { randomUUID } from 'node:crypto';

describe('UserFacade unit tests', () => {
  let sut: IUserFacade;
  let deps: UserFacadeDependencies;
  let findByIdUsecase: FindUserById.UseCase;
  let becomeAdminUsecase: BecomeAdmin.UseCase;
  let findByEmailUsecase: FindUserByEmail.UseCase;

  const findUserByIdoutput: FindUserByIdOutput = {
    id: randomUUID(),
    name: 'test',
    email: 'email@email.com',
    isAdmin: true,
  };
  const becomeAdminOutput: BecomeAdminOutput = {
    id: randomUUID(),
    name: 'test',
    email: 'email@email.com',
    isAdmin: true,
  };
  const findUserByEmailoutput: FindUserByEmailOutput = {
    id: randomUUID(),
    name: 'test',
    email: 'email@email.com',
    isAdmin: true,
    password: 'dsfdsfdsgdfhgfh',
  };

  beforeEach(() => {
    findByIdUsecase = {
      execute: jest.fn().mockResolvedValue(findUserByIdoutput),
    } as any as FindUserById.UseCase;
    becomeAdminUsecase = {
      execute: jest.fn().mockResolvedValue(becomeAdminOutput),
    } as any as BecomeAdmin.UseCase;
    findByEmailUsecase = {
      execute: jest.fn().mockResolvedValue(findUserByEmailoutput),
    } as any as FindUserByEmail.UseCase;
    deps = {
      findByIdUsecase,
      becomeAdminUsecase,
      findByEmailUsecase,
    };
    sut = new UserFacade(deps);
  });

  describe('findById', () => {
    it('sholud find an user by id', async () => {
      const result = await sut.findById({ id: findUserByIdoutput.id });

      expect(result).toStrictEqual(findUserByIdoutput);
      expect(findByIdUsecase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw if findByIdUsecase.execute throws', async () => {
      jest.spyOn(findByIdUsecase, 'execute').mockImplementationOnce(() => {
        throw new Error('');
      });

      await expect(
        sut.findById({ id: findUserByIdoutput.id }),
      ).rejects.toThrow();
    });
  });

  describe('becomeAdmin', () => {
    it('sholud find an user by id', async () => {
      const result = await sut.becomeAdmin({
        userId: becomeAdminOutput.id,
        actionDoneBy: randomUUID(),
      });

      expect(result).toStrictEqual(becomeAdminOutput);
      expect(becomeAdminUsecase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw if becomeAdminUsecase.execute throws', async () => {
      jest.spyOn(becomeAdminUsecase, 'execute').mockImplementationOnce(() => {
        throw new Error('');
      });

      await expect(
        sut.becomeAdmin({
          userId: becomeAdminOutput.id,
          actionDoneBy: randomUUID(),
        }),
      ).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('sholud find an user by eamil', async () => {
      const result = await sut.findByEmail({
        email: findUserByEmailoutput.email,
      });

      expect(result).toStrictEqual(findUserByEmailoutput);
      expect(findByEmailUsecase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw if findByEmailUsecase.execute throws', async () => {
      jest.spyOn(findByEmailUsecase, 'execute').mockImplementationOnce(() => {
        throw new Error('');
      });

      await expect(
        sut.findByEmail({ email: findUserByEmailoutput.email }),
      ).rejects.toThrow();
    });
  });
});
