import { role } from 'src/role/entity/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission_type: string;
}
