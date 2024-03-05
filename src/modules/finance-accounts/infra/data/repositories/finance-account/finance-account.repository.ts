import { randomUUID } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import {
  FinanceAccountEntity,
  FinanceAccountUserEntity,
} from '@finance-accounts/infra/data/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { DatabaseUtils } from '@shared/infra/database';

export class FinanceAccountRepository
  extends DatabaseUtils<FinanceAccountProps>
  implements IFinanceAccountRepository
{
  public static instance: FinanceAccountRepository | null = null;
  private financeAccountRepo: Repository<FinanceAccountEntity>;
  private financeAccountUserRepo: Repository<FinanceAccountUserEntity>;
  protected allowedFields: (keyof FinanceAccountProps)[] = [
    'id',
    'name',
    'date',
    'users',
  ];

  private constructor(protected readonly dataSource: DataSource) {
    super();
    this.financeAccountRepo = dataSource.getRepository(FinanceAccountEntity);
    this.financeAccountUserRepo = dataSource.getRepository(
      FinanceAccountUserEntity,
    );
  }

  public static createInstance(
    dataSource: DataSource,
  ): FinanceAccountRepository {
    if (!FinanceAccountRepository.instance) {
      FinanceAccountRepository.instance = new FinanceAccountRepository(
        dataSource,
      );
    }

    return this.instance;
  }

  public async create(data: FinanceAccountProps): Promise<void> {
    const finaceAccountUser = data.users.map((userId) => ({
      id: randomUUID(),
      user: userId,
      financeAccount: data.id,
    }));
    const createdEntity = this.financeAccountRepo.create({
      ...data,
      finaceAccountUser,
    });

    await this.financeAccountRepo.save(createdEntity);
  }

  public async addUserInAccount(data: FinanceAccountProps): Promise<void> {
    const finaceAccountUserList = await this.financeAccountUserRepo
      .createQueryBuilder('financeAccountUser')
      .leftJoinAndSelect('financeAccountUser.financeAccount', 'financeAccount')
      .leftJoinAndSelect('financeAccountUser.user', 'user')
      .where('financeAccountUser.financeAccount = :accountId', {
        accountId: data.id,
      })
      .select(['financeAccountUser.id'])
      .addSelect(['financeAccount.id'])
      .addSelect(['user.id'])
      .getMany();

    const addedUsers = finaceAccountUserList.map((item) => item.user?.['id']);
    const users = data.users.filter((user) => !addedUsers.includes(user));

    const createdFinaceAccountUsers = users.map((userId) => {
      return this.financeAccountUserRepo.create({
        id: randomUUID(),
        user: userId,
        financeAccount: data.id,
      });
    });

    await this.financeAccountUserRepo.save(createdFinaceAccountUsers);
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

    return {
      id: financeAccount.id,
      name: financeAccount.name,
      date: financeAccount.date,
      users: financeAccount.finaceAccountUser.map((item) => item.user?.['id']),
    };
  }
}
