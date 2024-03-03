import { Entity, ManyToOne } from 'typeorm';
import { EntityTypeOrm } from '@shared/infra/database/entities';
import { FinanceAccountEntity } from '@finance-accounts/infra/data/entities';
import { UserEntity } from '@users/infra/data/entities';

@Entity('finance-account-user')
export class FinanceAccountUserEntity extends EntityTypeOrm {
  @ManyToOne(() => UserEntity, (user) => user.finaceAccountUser, {
    onDelete: 'CASCADE',
  })
  user: string;

  @ManyToOne(
    () => FinanceAccountEntity,
    (account) => account.finaceAccountUser,
    {
      onDelete: 'CASCADE',
    },
  )
  financeAccount: string;
}
