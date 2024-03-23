import { IHasher } from '@shared/domain/crypto';
import { ConflictError } from '@shared/domain/errors';
import { CreateUser } from '@users/application/usecases';
import { UserFactory } from '@users/domain/entities';
import { IUserRepository } from '@users/domain/repositories';
import { IUserDataGetway } from '@users/infra/data/getways';

describe('CreateUserUseCase unit tests', () => {
  const mockedInput: CreateUser.Input = {
    name: 'test',
    email: 'test@example.com',
    password: 'Test@123',
  };
  const input = UserFactory.create(mockedInput);
  const mockedOutput: CreateUser.Output = {
    id: input.id,
    name: mockedInput.name,
    email: mockedInput.email,
    isAdmin: false,
  };

  let sut: CreateUser.UseCase;
  let mockedUserRepo: IUserRepository;
  let mockedUserDataGetway: IUserDataGetway;
  let mockedHasher: IHasher;

  beforeEach(() => {
    mockedUserRepo = {
      create: jest.fn().mockResolvedValue(input),
      emailExists: jest.fn().mockResolvedValue(false),
    } as any as IUserRepository;
    mockedUserDataGetway = {
      findByEmail: jest.fn().mockResolvedValue(null),
    } as any as IUserDataGetway;
    mockedHasher = {
      hash: jest.fn().mockResolvedValue('hashed value'),
    } as any as IHasher;
    sut = new CreateUser.UseCase(
      mockedUserRepo,
      mockedUserDataGetway,
      mockedHasher,
    );
  });

  it('should create an user', async () => {
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserDataGetway.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockedHasher.hash).toHaveBeenCalledTimes(1);
    expect(mockedUserRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if mockedUserDataGetway.findByEmail return true', async () => {
    jest
      .spyOn(mockedUserDataGetway, 'findByEmail')
      .mockResolvedValueOnce({ id: input.id });

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new ConflictError('email already exists'),
    );
  });

  it('should throw if mockedUserDataGetway.findByEmail throws', async () => {
    jest
      .spyOn(mockedUserDataGetway, 'findByEmail')
      .mockImplementationOnce(() => {
        throw new Error('');
      });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if hasher.hash throws', async () => {
    jest.spyOn(mockedHasher, 'hash').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if userWritingRepo.create throws', async () => {
    jest.spyOn(mockedUserRepo, 'create').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
