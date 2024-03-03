import { Column, Entity, OneToMany } from 'typeorm';
import { EntityTypeOrm } from '@shared/infra/database/entities';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';
import { FinanceAccountUserEntity } from '@finance-accounts/infra/data/entities';

@Entity('finance-accounts')
export class FinanceAccountEntity
  extends EntityTypeOrm
  implements Omit<FinanceAccountProps, 'users'>
{
  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(
    () => FinanceAccountUserEntity,
    (acocountUser) => acocountUser.financeAccount,
    {
      eager: true,
      cascade: true,
    },
  )
  finaceAccountUser: FinanceAccountUserEntity[];
}
