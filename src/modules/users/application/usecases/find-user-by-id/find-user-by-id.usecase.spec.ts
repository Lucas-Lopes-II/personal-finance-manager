import { randomUUID } from 'node:crypto';
import { BadRequestError, NotFoundError } from '@shared/domain/errors';
import { FindUserById } from '@users/application/usecases';
import { IUserRepository } from '@users/domain/repositories';

describe('FindUserById.UseCase unit tests', () => {
  const mockedInput: FindUserById.Input = {
    id: randomUUID(),
  };
  const mockedOutput: FindUserById.Output = {
    id: mockedInput.id,
    name: 'test name',
    email: 'email@test.com',
    isAdmin: false,
  };

  let sut: FindUserById.UseCase;
  let mockedUserRepo: IUserRepository;

  beforeEach(() => {
    mockedUserRepo = {
      findById: jest.fn().mockResolvedValue(mockedOutput),
    } as any as IUserRepository;

    sut = new FindUserById.UseCase(mockedUserRepo);
  });

  it('should find an user by id', async () => {
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserRepo.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundError if userReadingRepo.findById return null', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockResolvedValueOnce(null);

    await expect(sut.execute(mockedInput)).rejects.toThrow(
      new NotFoundError('user not found'),
    );
  });

  it('should throw if userReadingRepo.findById throws', async () => {
    jest.spyOn(mockedUserRepo, 'findById').mockImplementationOnce(() => {
      throw new Error('');
    });

    await expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw a BadRequestError if given id is invalid', async () => {
    let data = { ...mockedInput, id: 'wrong id' };
    await expect(sut.execute(data)).rejects.toThrow(
      new BadRequestError('id in invalid format'),
    );

    data = { ...mockedInput, id: null };
    await expect(sut.execute(data)).rejects.toThrow(
      new BadRequestError('id is required'),
    );
  });
});
