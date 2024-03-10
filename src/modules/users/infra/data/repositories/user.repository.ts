import { UserEntity } from '@users/infra/data/entities/user.entity';
import { IUser, UserFactory, UserProps } from '@users/domain/entities';
import { IUserRepository } from '@users/domain/repositories';
import { DataSource, Repository } from 'typeorm';
import { DatabaseUtils } from '@shared/infra/database';

export class UserRepository
  extends DatabaseUtils<UserProps>
  implements IUserRepository
{
  public static instance: UserRepository | null = null;
  public userRepo: Repository<UserEntity>;
  protected allowedFields: (keyof UserProps)[] = [
    'id',
    'name',
    'email',
    'isAdmin',
    'password',
  ];

  private constructor(protected readonly dataSource: DataSource) {
    super();
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

  public async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { email: email },
    });

    return !!user;
  }

  public findByEmail(
    email: string,
    fields: (keyof UserProps)[] = [],
  ): Promise<UserProps | Partial<UserProps>> {
    const select = this.createSelectByFields(fields);

    return this.userRepo.findOne({
      select,
      where: { email: email.toLowerCase() },
    });
  }

  public findById(
    id: string,
    fields: (keyof UserProps)[] = [],
  ): Promise<UserProps | Partial<UserProps>> {
    const select = this.createSelectByFields(fields);

    return this.userRepo.findOne({
      select,
      where: { id: id },
    });
  }

  public async update(id: string, data: Partial<UserProps>): Promise<IUser> {
    const updateEntity = await this.userRepo.preload({ ...data, id });
    await this.userRepo.save(updateEntity);

    return UserFactory.create(updateEntity);
  }
}
