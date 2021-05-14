import { Entity, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @PrimaryColumn()
  permission: string;
}
