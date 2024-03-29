import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { CareerEntity } from './career.entity';
import { VacationsEntity } from '../../vacations/entity/vacations.entity';
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

  @ManyToOne(() => RoleEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role' })
  role: RoleEntity;

  @ManyToOne(() => CareerLevelEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'level' })
  level: CareerLevelEntity;

  @OneToMany(() => CareerEntity, (career) => career.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  career: CareerEntity[];

  @OneToMany(() => VacationsEntity, (vacation) => vacation.user)
  vacations: VacationsEntity[];
}
