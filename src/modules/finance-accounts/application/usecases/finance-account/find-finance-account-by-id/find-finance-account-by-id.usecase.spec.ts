import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { randomUUID } from 'crypto';
import { FindFinanceAccountById } from '@finance-accounts/application/usecases';

describe('FindFinanceAccountById.UseCase unit tests', () => {
  const mockedInput: FindFinanceAccountById.Input = {
    id: randomUUID(),
    selectedFields: [],
  };
  const mockedOutut: FindFinanceAccountById.Output = {
    id: randomUUID(),
    name: 'Name 1',
    date: new Date().toISOString(),
    users: [mockedInput.id],
  };

  let sut: FindFinanceAccountById.UseCase;
  let mockedFinanceAccountRepo: IFinanceAccountRepository;

  beforeEach(() => {
    mockedFinanceAccountRepo = {
      findById: jest.fn().mockResolvedValue(mockedOutut),
    } as any as IFinanceAccountRepository;
    sut = new FindFinanceAccountById.UseCase(mockedFinanceAccountRepo);
  });

  it('should find a FinanceAccount by id', async () => {
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutut);
    expect(mockedFinanceAccountRepo.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw if userRepo.findById throws', async () => {
    jest
      .spyOn(mockedFinanceAccountRepo, 'findById')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
