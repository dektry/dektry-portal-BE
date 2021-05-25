import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'careers' })
export class CareerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.career)
  user: UserEntity;

  @Column()
  salary: number;

  @Column({ type: 'timestamptz' })
  from: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  to: Date;

  @ManyToOne(() => PositionEntity)
  @JoinTable({ name: 'position' })
  position: PositionEntity;
}
