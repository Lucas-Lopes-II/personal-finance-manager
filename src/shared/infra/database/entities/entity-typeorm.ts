import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import {
  IBaseEntityDB,
  IBaseEntityDBWithAuditFields,
} from '@shared/domain/entities';

export class EntityTypeOrm implements IBaseEntityDB {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ nullable: true, name: 'created_at' })
  createdAt?: Date;

  @Column({ nullable: true })
  status?: string;
}

export class EntityTypeOrmWithAuditColumns
  extends EntityTypeOrm
  implements IBaseEntityDBWithAuditFields
{
  updatedAt?: Date;

  @Column({ nullable: true, name: 'created_by' })
  createdBy?: string;

  @Column({ nullable: true, name: 'updated_by' })
  updatedBy?: string;

  @Column({ nullable: true, name: 'deleted_by' })
  deletedBy?: string;
}
