import { IHasher } from '@shared/domain/crypto';
import { Signin } from '@auth/application/usecases';
import { IUserRepository } from '@users/domain/repositories';
import { randomUUID } from 'crypto';
import { BadRequestError } from '@shared/domain/errors';

describe('Signin.UseCase unit tests', () => {
  const id = randomUUID();
  const mockedInput: Signin.Input = {
    email: 'test@example.com',
    password: 'Test@123',
  };
  const mockedOutput: Signin.Output = {
    id,
    name: 'Name',
    isAdmin: false,
    email: mockedInput.email,
  };

  let sut: Signin.UseCase;
  let mockedUserRepo: IUserRepository;
  let mockedHasher: IHasher;

  beforeEach(() => {
    mockedUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(mockedOutput),
    } as any as IUserRepository;
    mockedHasher = {
      compare: jest.fn().mockResolvedValue(true),
    } as any as IHasher;
    sut = new Signin.UseCase(mockedUserRepo, mockedHasher);
  });

  it('should sign-in correctly', async () => {
    const result = await sut.execute(mockedInput);

    expect(result).toStrictEqual(mockedOutput);
    expect(mockedUserRepo.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockedHasher.compare).toHaveBeenCalledTimes(1);
  });

  it('should throw a BadRequestError if there is no user with given email', async () => {
    jest.spyOn(mockedUserRepo, 'findByEmail').mockResolvedValueOnce(null);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('E-mail and/or Password is wrong'),
    );
  });

  it('should throw a BadRequestError if the password comparation return false', async () => {
    jest.spyOn(mockedHasher, 'compare').mockResolvedValueOnce(false);

    expect(sut.execute(mockedInput)).rejects.toThrow(
      new BadRequestError('E-mail and/or Password is wrong'),
    );
  });

  it('should throw if mockedUserRepo.findByEmail throws', async () => {
    jest.spyOn(mockedUserRepo, 'findByEmail').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });

  it('should throw if mockedHasher.compare throws', async () => {
    jest.spyOn(mockedHasher, 'compare').mockImplementationOnce(() => {
      throw new Error('');
    });

    expect(sut.execute(mockedInput)).rejects.toThrow();
  });
});
