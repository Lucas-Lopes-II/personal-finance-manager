import { dataSource } from '@shared/infra/database';
import { IUserDataGetway, UserDataGetway } from '@users/infra/data/getways';

export class UserDataGetwayFactory {
  public static create(): IUserDataGetway {
    return UserDataGetway.createInstance(dataSource);
  }
}
