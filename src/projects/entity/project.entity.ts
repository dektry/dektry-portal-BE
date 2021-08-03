import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'users/entity/user.entity';

@Entity({ name: 'projects' })
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('uuid', { array: true })
  managers: string[];

  @Column('uuid', { array: true })
  users: string[];
}
