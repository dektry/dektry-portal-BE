import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'permission' })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission_type: string;

  @Column()
  R: boolean;

  @Column()
  W: boolean;
}
