import {
  Entity,
  PrimaryColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
  @PrimaryColumn()
  roleName: string;

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role',
      referencedColumnName: 'roleName',
    },
    inverseJoinColumn: {
      name: 'permission',
      referencedColumnName: 'permission',
    },
  })
  permission: PermissionEntity[];
}
