import { randomUUID } from 'node:crypto';
import { Validation } from '@shared/domain/validations';
import { BadRequestError } from '@shared/domain/errors';
import { IUserFacade } from '@users/infra/facades';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { AddUserInFinanceAccount } from './add-user-in-finance-account.usecase';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

describe('AddUserInFinanceAccount.UseCase unit tests', () => {
  const mockedInput: AddUserInFinanceAccount.Input = {
    userId: randomUUID(),
    accountId: randomUUID(),
    actionDoneBy: randomUUID(),
  };

  const financeAccountData: FinanceAccountProps = {
    id: randomUUID(),
    name: 'test',
    users: [mockedInput.actionDoneBy],
    date: new Date().toISOString(),
  };
  const financeAccount = FinanceAccountFactory.create(financeAccountData);

  let sut: AddUserInFinanceAccount.UseCase;
  let mockedFinanceAccountRepo: IFinanceAccountRepository;
  let mockedUserFacade: IUserFacade;
  let mockedValidator: Validation;

  beforeEach(() => {
    mockedFinanceAccountRepo = {
      find: jest.fn().mockResolvedValue(financeAccount),
      addUserInAccount: jest.fn().mockResolvedValue(undefined),
    } as any as IFinanceAccountRepository;
    mockedUserFacade = {
      findById: jest.fn().mockResolvedValue({ id: mockedInput.userId }),
    } as any as IUserFacade;
    mockedValidator = {
      validate: jest.fn().mockReturnValue(undefined),
    } as any as Validation;
    sut = new AddUserInFinanceAccount.UseCase(
      mockedFinanceAccountRepo,
      mockedUserFacade,
      mockedValidator,
    );
  });

  it('should add new user in FinanceAccount', async () => {
    await expect(sut.execute(mockedInput)).resolves.not.toThrow();
    expect(mockedUserFacade.findById).toHaveBeenCalledTimes(1);
    expect(mockedValidator.validate).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if there is no user with given userId', async () => {
    jest.spyOn(mockedUserFacade, 'findById').mockResolvedValueOnce(null);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('User do not exists'),
    );
  });

  it('should throw if userRepo.findById throws', async () => {
    jest.spyOn(mockedUserFacade, 'findById').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if validator.addUserInAccount throws', async () => {
    jest.spyOn(mockedValidator, 'validate').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
