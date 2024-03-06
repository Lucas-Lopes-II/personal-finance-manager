import { IHasher } from '@shared/domain/crypto';
import { ConflictError } from '@shared/domain/errors';
import { CreateUser } from '@users/application/usecases';
import { UserFactory } from '@users/domain/entities';
import { IUserRepository } from '@users/domain/repositories';

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
  };

  let sut: CreateUser.UseCase;
  let mockedUserRepo: IUserRepository;
  let mockedHasher: IHasher;

  beforeEach(() => {
    mockedUserRepo = {
      create: jest.fn().mockResolvedValue(input),
      emailExists: jest.fn().mockResolvedValue(false),
    } as any as IUserRepository;
    mockedHasher = {
      hash: jest.fn().mockResolvedValue('hashed value'),
    } as any as IHasher;
    sut = new CreateUser.UseCase(mockedUserRepo, mockedHasher);
  });

  it('should create an user', async () => {
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserRepo.emailExists).toHaveBeenCalledTimes(1);
    expect(mockedHasher.hash).toHaveBeenCalledTimes(1);
    expect(mockedUserRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if userReadingRepo.emailExists return true', async () => {
    jest.spyOn(mockedUserRepo, 'emailExists').mockResolvedValueOnce(true);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new ConflictError('email already exists'),
    );
  });

  it('should throw if userReadingRepo.emailExists throws', async () => {
    jest.spyOn(mockedUserRepo, 'emailExists').mockImplementationOnce(() => {
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
