import { randomUUID } from 'node:crypto';
import { IUserFacade } from '@users/infra/facades';
import { UserFactory } from '@users/domain/entities';
import { BecomeAdminUser } from './become-admin-user.usecase';

describe('BecomeAdminUser.UseCase unit tests', () => {
  const mockedInput: BecomeAdminUser.Input = {
    userId: randomUUID(),
    actionDoneBy: randomUUID(),
  };
  const mockedOutput: BecomeAdminUser.Output = {
    id: mockedInput.userId,
    name: 'Name 1',
    email: 'email1@test.com',
  };
  const updatedUser = UserFactory.create({
    id: mockedInput.userId,
    name: 'Name 1',
    email: 'email1@test.com',
    isAdmin: false,
    password: 'Test@123',
  });

  let sut: BecomeAdminUser.UseCase;
  let mockedUserFacade: IUserFacade;

  beforeEach(() => {
    mockedUserFacade = {
      becomeAdmin: jest.fn().mockResolvedValue(updatedUser),
    } as any as IUserFacade;
    sut = new BecomeAdminUser.UseCase(mockedUserFacade);
  });

  it('should become admin user correctly', async () => {
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserFacade.becomeAdmin).toHaveBeenCalledTimes(1);
  });

  it('should throw if  mockedUserRepo.becomeAdmin throws', async () => {
    jest.spyOn(mockedUserFacade, 'becomeAdmin').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
