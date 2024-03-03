import { randomUUID } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { FinanceAccountEntity } from '@finance-accounts/infra/data/entities';
import { IFinanceAccountRepository } from '@finance-accounts/domain/repositories';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';

export class FinanceAccountRepository implements IFinanceAccountRepository {
  public static instance: FinanceAccountRepository | null = null;
  public FinanceAccountRepo: Repository<FinanceAccountEntity>;
  protected allowedFields: (keyof FinanceAccountEntity)[] = [
    'id',
    'name',
    'date',
  ];

  private constructor(protected readonly dataSource: DataSource) {
    this.FinanceAccountRepo = dataSource.getRepository(FinanceAccountEntity);
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
    const createdEntity = this.FinanceAccountRepo.create({
      ...data,
      finaceAccountUser,
    });

    await this.FinanceAccountRepo.save(createdEntity);
  }
}
