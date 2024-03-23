import { randomUUID } from 'node:crypto';
import { BadRequestError } from '@shared/domain/errors';
import { IUserFacade } from '@users/infra/facades';
import { CreateFinanceAccount } from './create-finance-account.usecase';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';

describe('CreateFinanceAccount.UseCase unit tests', () => {
  const mockedInput: CreateFinanceAccount.Input = {
    name: 'test',
    userId: randomUUID(),
    date: new Date().toISOString(),
  };

  let sut: CreateFinanceAccount.UseCase;
  let mockedFinanceAccountRepo: IFinanceAccountRepository;
  let mockedUserFacade: IUserFacade;

  beforeEach(() => {
    mockedFinanceAccountRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    } as any as IFinanceAccountRepository;
    mockedUserFacade = {
      findById: jest.fn().mockResolvedValue({ id: mockedInput.userId }),
    } as any as IUserFacade;
    sut = new CreateFinanceAccount.UseCase(
      mockedFinanceAccountRepo,
      mockedUserFacade,
    );
  });

  it('should create a FinanceAccount', async () => {
    await expect(sut.execute(mockedInput)).resolves.not.toThrow();
    expect(mockedUserFacade.findById).toHaveBeenCalledTimes(1);
    expect(mockedFinanceAccountRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if there is no user with given userId', async () => {
    jest.spyOn(mockedUserFacade, 'findById').mockResolvedValueOnce(null);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('user do not exists'),
    );
  });

  it('should throw if userRepo.findById throws', async () => {
    jest.spyOn(mockedUserFacade, 'findById').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if financeAccountRepo.create throws', async () => {
    jest
      .spyOn(mockedFinanceAccountRepo, 'create')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
