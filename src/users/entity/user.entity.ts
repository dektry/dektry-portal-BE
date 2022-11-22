import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { CareerLevelEntity } from './careerLevel.entity';

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

  @Column({ default: 160 })
  balance: number;

  @ManyToOne(() => CareerLevelEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'level' })
  level: CareerLevelEntity;
}
