import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  BaseEntity,
  getManager,
} from 'typeorm';
import { permission } from '../../permission/entity/permission.entity';

@Entity()
export class role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @ManyToMany(() => permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissions',
      referencedColumnName: 'id',
    },
  })
  permission: any;
}
