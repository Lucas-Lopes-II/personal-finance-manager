import { DataSource, Repository } from 'typeorm';
import { DatabaseUtils } from '@shared/infra/database';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { FinanceAccountEntity } from '@finance-accounts/infra/data/entities';
import { IFinanceAccountDataGetway } from '@finance-accounts/infra/data/getways';

export class FinanceAccountDataGetway
  extends DatabaseUtils<FinanceAccountProps>
  implements IFinanceAccountDataGetway
{
  public static instance: FinanceAccountDataGetway | null = null;
  private financeAccountRepo: Repository<FinanceAccountEntity>;
  protected allowedFields: (keyof FinanceAccountProps)[] = [
    'id',
    'name',
    'date',
    'users',
  ];

  private constructor(protected readonly dataSource: DataSource) {
    super();
    this.financeAccountRepo = dataSource.getRepository(FinanceAccountEntity);
  }

  public static createInstance(
    dataSource: DataSource,
  ): FinanceAccountDataGetway {
    if (!FinanceAccountDataGetway.instance) {
      FinanceAccountDataGetway.instance = new FinanceAccountDataGetway(
        dataSource,
      );
    }

    return this.instance;
  }

  public async findById(
    id: string,
    fields: (keyof FinanceAccountProps)[] = [],
  ): Promise<FinanceAccountProps | Partial<FinanceAccountProps>> {
    const select = this.createQueryBuilderSelectByFields(
      'financeAccount',
      fields,
    );

    const financeAccount = await this.financeAccountRepo
      .createQueryBuilder('financeAccount')
      .select(select)
      .leftJoinAndSelect(
        'financeAccount.finaceAccountUser',
        'finaceAccountUser',
      )
      .leftJoinAndSelect('finaceAccountUser.user', 'user')
      .where('financeAccount.id = :id', {
        id,
      })
      .addSelect(['user.id'])
      .getOne();

    if (!financeAccount) return;

    return {
      id: financeAccount.id,
      name: financeAccount.name,
      date: financeAccount.date,
      users: financeAccount.finaceAccountUser.map((item) => item.user?.['id']),
    };
  }

  public async findByUserId(
    userId: string,
    fields: (keyof FinanceAccountProps)[] = [],
  ): Promise<FinanceAccountProps[] | Partial<FinanceAccountProps>[]> {
    const select = this.createQueryBuilderSelectByFields(
      'financeAccount',
      fields,
    );

    const financeAccounts = await this.financeAccountRepo
      .createQueryBuilder('financeAccount')
      .select(select)
      .innerJoinAndSelect(
        'financeAccount.finaceAccountUser',
        'finaceAccountUser',
      )
      .innerJoinAndSelect('finaceAccountUser.user', 'user')
      .where('user.id = :userId', {
        userId,
      })
      .addSelect(['finaceAccountUser.user'])
      .addSelect(['user.id'])
      .getMany();

    return financeAccounts.map((financeAccount) => ({
      id: financeAccount.id,
      name: financeAccount.name,
      date: financeAccount.date,
      users: financeAccount.finaceAccountUser.map((item) => item.user?.['id']),
    }));
  }
}
