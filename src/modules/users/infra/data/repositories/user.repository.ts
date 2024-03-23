import { DataSource, Equal, Repository } from 'typeorm';
import { IUserRepository } from '@users/domain/repositories';
import { UserEntity } from '@users/infra/data/entities/user.entity';
import { IUser, UserFactory, UserProps } from '@users/domain/entities';

export class UserRepository implements IUserRepository {
  public static instance: UserRepository | null = null;
  public userRepo: Repository<UserEntity>;

  private constructor(protected readonly dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(UserEntity);
  }

  public static createInstance(dataSource: DataSource): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(dataSource);
    }

    return this.instance;
  }

  public async create(data: IUser): Promise<IUser> {
    const createdEntity = this.userRepo.create(data.toJSON());
    const savedEntity = await this.userRepo.save(createdEntity);

    return UserFactory.create(savedEntity);
  }

  public async find(id: string): Promise<IUser> {
    const data = await this.userRepo.findOne({
      where: { id: Equal(id) },
    });

    if (!data) {
      return null;
    }

    return UserFactory.create(data);
  }

  public async update(id: string, data: Partial<UserProps>): Promise<IUser> {
    const updateEntity = await this.userRepo.preload({ ...data, id });
    await this.userRepo.save(updateEntity);

    return UserFactory.create(updateEntity);
  }
}
