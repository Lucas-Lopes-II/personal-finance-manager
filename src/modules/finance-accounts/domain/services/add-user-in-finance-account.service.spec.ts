import { randomUUID } from 'node:crypto';
import { BadRequestError, ForbiddenError } from '@shared/domain/errors';
import {
  AddUserInFinanceAccountService,
  AddUserInFinanceAccountServiceDto,
} from '@finance-accounts/domain/services';
import {
  FinanceAccountFactory,
  FinanceAccountProps,
} from '@finance-accounts/domain/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

describe('AddUserInFinanceAccountService unit tests', () => {
  const mockedInput: AddUserInFinanceAccountServiceDto = {
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

  let sut: AddUserInFinanceAccountService;
  let mockedFinanceAccountRepo: IFinanceAccountRepository;

  beforeEach(() => {
    mockedFinanceAccountRepo = {
      find: jest.fn().mockResolvedValue(financeAccount),
      addUserInAccount: jest.fn().mockResolvedValue(undefined),
    } as any as IFinanceAccountRepository;

    sut = new AddUserInFinanceAccountService(mockedFinanceAccountRepo);
  });

  it('should add new user in FinanceAccount', async () => {
    await expect(sut.add(mockedInput)).resolves.not.toThrow();
    expect(mockedFinanceAccountRepo.find).toHaveBeenCalledTimes(1);
    expect(mockedFinanceAccountRepo.addUserInAccount).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if there is no financeAccount with given accountId', async () => {
    jest.spyOn(mockedFinanceAccountRepo, 'find').mockResolvedValueOnce(null);

    expect(sut.add(mockedInput)).rejects.toThrow(
      new BadRequestError('Finance account do not exists'),
    );
  });

  it('should throw if financeAccountRepo.find throws', async () => {
    jest.spyOn(mockedFinanceAccountRepo, 'find').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.add(mockedInput)).rejects.toThrow();
  });

  it('should throw a ForbiddenError if the user adding the new user does not belong to the account', async () => {
    const stubFinanceAccountData: FinanceAccountProps = {
      id: randomUUID(),
      name: 'test',
      users: [randomUUID()],
      date: new Date().toISOString(),
    };
    const financeAccount = FinanceAccountFactory.create(stubFinanceAccountData);
    jest
      .spyOn(mockedFinanceAccountRepo, 'find')
      .mockResolvedValueOnce(financeAccount);

    expect(sut.add(mockedInput)).rejects.toThrow(
      new ForbiddenError('Action not allowed'),
    );
  });

  it('should throw if financeAccountRepo.addUserInAccount throws', async () => {
    jest
      .spyOn(mockedFinanceAccountRepo, 'addUserInAccount')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.add(mockedInput)).rejects.toThrow();
  });
});
