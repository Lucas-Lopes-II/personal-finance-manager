import { randomUUID } from 'node:crypto';
import { BadRequestError, NotFoundError } from '@shared/domain/errors';
import { IUserDataGetway } from '@users/infra/data/getways';
import { FindUserByEmail } from '@users/application/usecases';

describe('FindUserByEmail.UseCase unit tests', () => {
  const mockedInput: FindUserByEmail.Input = {
    email: 'email@test.com',
  };
  const mockedOutput: FindUserByEmail.Output = {
    id: randomUUID(),
    name: 'test name',
    email: 'email@test.com',
    isAdmin: false,
    password: 'dsjfdsofhsdh',
  };

  let sut: FindUserByEmail.UseCase;
  let mockedUserGetway: IUserDataGetway;

  beforeEach(() => {
    mockedUserGetway = {
      findByEmail: jest.fn().mockResolvedValue(mockedOutput),
    } as any as IUserDataGetway;

    sut = new FindUserByEmail.UseCase(mockedUserGetway);
  });

  it('should find an user by email', async () => {
    let result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserGetway.findByEmail).toHaveBeenCalledTimes(1);

    let output = {
      ...mockedOutput,
      isAdmin: undefined,
    };
    jest.spyOn(mockedUserGetway, 'findByEmail').mockResolvedValueOnce(output);
    result = await sut.execute({
      ...mockedInput,
      selectedfields: ['id', 'name', 'email', 'password'],
    });

    expect(result).toStrictEqual(output);

    output = {
      id: undefined,
      isAdmin: true,
      email: undefined,
      name: undefined,
      password: undefined,
    };
    jest.spyOn(mockedUserGetway, 'findByEmail').mockResolvedValueOnce(output);
    result = await sut.execute({
      ...mockedInput,
      selectedfields: ['isAdmin'],
    });

    expect(result).toStrictEqual(output);
  });

  it('should throw a NotFoundError if userReadingRepo.findByEmail return null', async () => {
    jest.spyOn(mockedUserGetway, 'findByEmail').mockResolvedValueOnce(null);

    await expect(sut.execute(mockedInput)).rejects.toThrow(
      new NotFoundError('user not found'),
    );
  });

  it('should throw if userReadingRepo.findByEmail throws', async () => {
    jest.spyOn(mockedUserGetway, 'findByEmail').mockImplementationOnce(() => {
      throw new Error('');
    });

    await expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw a BadRequestError if given email is invalid', async () => {
    let data = { ...mockedInput, email: 'wrong email' };
    await expect(sut.execute(data)).rejects.toThrow(
      new BadRequestError('email in invalid format'),
    );

    data = { ...mockedInput, email: null };
    await expect(sut.execute(data)).rejects.toThrow(
      new BadRequestError('email is required'),
    );
  });
});
