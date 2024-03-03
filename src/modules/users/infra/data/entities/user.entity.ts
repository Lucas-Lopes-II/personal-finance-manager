import { Column, Entity, OneToMany } from 'typeorm';
import { UserProps } from '@users/domain/entities';
import { EntityTypeOrm } from '@shared/infra/database/entities';
import { FinanceAccountUserEntity } from '@finance-accounts/infra/data/entities';

@Entity('users')
export class UserEntity extends EntityTypeOrm implements UserProps {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false, name: 'is_admin' })
  isAdmin: boolean;

  @OneToMany(
    () => FinanceAccountUserEntity,
    (acocountUser) => acocountUser.user,
    {
      cascade: true,
    },
  )
  finaceAccountUser: FinanceAccountUserEntity[];
}
