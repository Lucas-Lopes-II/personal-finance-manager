import { BadRequestError } from '@shared/domain/errors';
import { UserFactory } from '@users/domain/entities';
import { randomUUID } from 'crypto';
import { BecomeAdmin } from './become-admin.usecase';
import { IUserRepository } from '@users/domain/repositories';

describe('BecomeAdmin.UseCase unit tests', () => {
  const mockedInput: BecomeAdmin.Input = {
    userId: randomUUID(),
    actionDoneBy: randomUUID(),
  };
  const mockedOutput: BecomeAdmin.Output = {
    id: mockedInput.userId,
    name: 'Name 1',
    email: 'email1@test.com',
    isAdmin: true,
  };
  const userAdmin = UserFactory.create({
    id: mockedInput.actionDoneBy,
    name: 'Name',
    email: 'email@test.com',
    isAdmin: true,
    password: 'Test@123',
  });
  const updateUser = UserFactory.create({
    id: mockedInput.userId,
    name: 'Name 1',
    email: 'email1@test.com',
    isAdmin: false,
    password: 'Test@123',
  });

  let sut: BecomeAdmin.UseCase;
  let mockedUserRepo: IUserRepository;

  beforeEach(() => {
    mockedUserRepo = {
      findById: jest.fn().mockResolvedValue(userAdmin),
      update: jest.fn().mockResolvedValue(updateUser),
    } as any as IUserRepository;
    sut = new BecomeAdmin.UseCase(mockedUserRepo);
  });

  it('should become admin user correctly', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockResolvedValueOnce(userAdmin);
    jest
      .spyOn(mockedUserRepo, 'findById')
      .mockResolvedValueOnce(updateUser.toJSON());
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserRepo.findById).toHaveBeenCalledTimes(2);
    expect(mockedUserRepo.update).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if user with given userId not exists', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockResolvedValueOnce(userAdmin);
    jest.spyOn(mockedUserRepo, 'findById').mockResolvedValueOnce(null);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('user do not exists'),
    );
  });

  it('should throw if mockedUserRepo.findById throws', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if  mockedUserRepo.update throws', async () => {
    jest.spyOn(mockedUserRepo, 'update').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
