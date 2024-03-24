import { randomUUID } from 'crypto';
import { BadRequestError } from '@shared/domain/errors';
import { IUserFacade } from '@users/infra/facades';
import { FindFinanceAccountsByUserId } from '@finance-accounts/application/usecases';
import { IFinanceAccountDataGetway } from '@finance-accounts/infra/data/getways';

describe('FindFinanceAccountsByUserId.UseCase unit tests', () => {
  const mockedInput: FindFinanceAccountsByUserId.Input = {
    userId: randomUUID(),
    selectedFields: [],
  };
  const mockedOutut: FindFinanceAccountsByUserId.Output = [
    {
      id: randomUUID(),
      name: 'Name 1',
      date: new Date().toISOString(),
      users: [mockedInput.userId],
    },
    {
      id: randomUUID(),
      name: 'Name 2',
      date: new Date().toISOString(),
      users: [mockedInput.userId],
    },
  ];

  let sut: FindFinanceAccountsByUserId.UseCase;
  let mockedFinanceAccountDataGetway: IFinanceAccountDataGetway;
  let mockedUserFacade: IUserFacade;

  beforeEach(() => {
    mockedFinanceAccountDataGetway = {
      findByUserId: jest.fn().mockResolvedValue(mockedOutut),
    } as any as IFinanceAccountDataGetway;
    mockedUserFacade = {
      findById: jest.fn().mockResolvedValue({ id: mockedInput.userId }),
    } as any as IUserFacade;
    sut = new FindFinanceAccountsByUserId.UseCase(
      mockedFinanceAccountDataGetway,
      mockedUserFacade,
    );
  });

  it('should return FinanceAccounts of user', async () => {
    const result = await sut.execute(mockedInput);
    const sameUser = result.every(
      (item) => item.users[0] === mockedInput.userId,
    );

    expect(result).toStrictEqual(mockedOutut);
    expect(sameUser).toBeTruthy();
    expect(mockedUserFacade.findById).toHaveBeenCalledTimes(1);
    expect(mockedFinanceAccountDataGetway.findByUserId).toHaveBeenCalledTimes(
      1,
    );
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

  it('should throw if financeAccountDataGetway.findByUserId throws', async () => {
    jest
      .spyOn(mockedFinanceAccountDataGetway, 'findByUserId')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
