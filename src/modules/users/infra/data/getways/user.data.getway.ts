import { DataSource, Equal, Repository } from 'typeorm';
import { DatabaseUtils } from '@shared/infra/database';
import { UserProps } from '@users/domain/entities';
import { IUserDataGetway } from '@users/infra/data/getways';
import { UserEntity } from '@users/infra/data/entities/user.entity';

export class UserDataGetway
  extends DatabaseUtils<UserProps>
  implements IUserDataGetway
{
  public static instance: UserDataGetway | null = null;
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

  public static createInstance(dataSource: DataSource): UserDataGetway {
    if (!UserDataGetway.instance) {
      UserDataGetway.instance = new UserDataGetway(dataSource);
    }

    return this.instance;
  }

  public findById(
    id: string,
    fields: (keyof UserProps)[] = [],
  ): Promise<UserProps | Partial<UserProps>> {
    const select = this.createSelectByFields(fields);

    return this.userRepo.findOne({
      select,
      where: { id: Equal(id) },
    });
  }
}
