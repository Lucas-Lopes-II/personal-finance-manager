import { randomUUID } from 'node:crypto';
import { BadRequestError, NotFoundError } from '@shared/domain/errors';
import { FindUserById } from '@users/application/usecases';
import { IUserDataGetway } from '@users/infra/data/getways';

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
  let mockedUserGetway: IUserDataGetway;

  beforeEach(() => {
    mockedUserGetway = {
      findById: jest.fn().mockResolvedValue(mockedOutput),
    } as any as IUserDataGetway;

    sut = new FindUserById.UseCase(mockedUserGetway);
  });

  it('should find an user by id', async () => {
    let result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserGetway.findById).toHaveBeenCalledTimes(1);

    let output = {
      ...mockedOutput,
      isAdmin: undefined,
    };
    jest.spyOn(mockedUserGetway, 'findById').mockResolvedValueOnce(output);
    result = await sut.execute({
      ...mockedInput,
      selectedfields: ['id', 'name', 'email'],
    });

    expect(result).toStrictEqual(output);

    output = {
      id: undefined,
      isAdmin: true,
      email: undefined,
      name: undefined,
    };
    jest.spyOn(mockedUserGetway, 'findById').mockResolvedValueOnce(output);
    result = await sut.execute({
      ...mockedInput,
      selectedfields: ['isAdmin'],
    });

    expect(result).toStrictEqual(output);
  });

  it('should throw a NotFoundError if userReadingRepo.findById return null', async () => {
    jest.spyOn(mockedUserGetway, 'findById').mockResolvedValueOnce(null);

    await expect(sut.execute(mockedInput)).rejects.toThrow(
      new NotFoundError('user not found'),
    );
  });

  it('should throw if userReadingRepo.findById throws', async () => {
    jest.spyOn(mockedUserGetway, 'findById').mockImplementationOnce(() => {
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
