import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  name: string;
}
