import { dataSource } from '@shared/infra/database';
import {
  FinanceAccountDataGetway,
  IFinanceAccountDataGetway,
} from '@finance-accounts/infra/data/getways';

export class FinanceAccountDataGetwayFactory {
  public static create(): IFinanceAccountDataGetway {
    return FinanceAccountDataGetway.createInstance(dataSource);
  }
}
