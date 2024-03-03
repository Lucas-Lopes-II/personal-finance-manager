import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { BadRequestError } from '@shared/domain/errors';
import { IUserRepository } from '@users/domain/repositories';
import { randomUUID } from 'crypto';
import { CreateFinanceAccount } from './create-finance-account.usecase';

describe('CreateFinanceAccount.UseCase unit tests', () => {
  const mockedInput: CreateFinanceAccount.Input = {
    name: 'test',
    userId: randomUUID(),
    date: new Date().toISOString(),
  };

  let sut: CreateFinanceAccount.UseCase;
  let mockedFinanceAccountRepo: IFinanceAccountRepository;
  let mockedUserRepo: IUserRepository;

  beforeEach(() => {
    mockedFinanceAccountRepo = {
      create: jest.fn().mockResolvedValue(undefined),
    } as any as IFinanceAccountRepository;
    mockedUserRepo = {
      findById: jest.fn().mockResolvedValue({ id: mockedInput.userId }),
    } as any as IUserRepository;
    sut = new CreateFinanceAccount.UseCase(
      mockedFinanceAccountRepo,
      mockedUserRepo,
    );
  });

  it('should create a FinanceAccount', async () => {
    await expect(sut.execute(mockedInput)).resolves.not.toThrow();
    expect(mockedUserRepo.findById).toHaveBeenCalledTimes(1);
    expect(mockedFinanceAccountRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should thow a BadRequestError if there is no user with given userId', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockResolvedValueOnce(null);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('user do not exists'),
    );
  });

  it('should throw if userRepo.findById throws', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockImplementationOnce(() => {
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
