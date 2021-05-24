import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { PositionEntity } from './position.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  firstName: string;

  @Column({ length: 20 })
  lastName: string;

  @Column({ unique: true, length: 40 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255, default: 'default_admin.png' })
  avatarFileName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz' })
  birthday: Date;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role' })
  role: RoleEntity;

  @ManyToOne(() => PositionEntity)
  @JoinColumn({ name: 'job_position' })
  position: PositionEntity;
}
