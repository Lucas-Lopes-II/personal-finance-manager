import { Column, Entity } from 'typeorm';
import { EntityTypeOrm } from '@shared/infra/database/entities';
import { FinanceAccountProps } from '@finance-accounts/domain/entities';

@Entity('finance-accounts')
export class FinanceAccountEntity
  extends EntityTypeOrm
  implements Omit<FinanceAccountProps, 'users'>
{
  @Column({ nullable: false, type: 'timestamptz' })
  date: string;

  @Column({ nullable: false })
  name: string;
}
