import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';

@Entity({ name: 'vacations' })
export class VacationsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: ['VAC', 'SICK', 'LEAVE'] })
  policy: string;

  @Column({ type: 'timestamptz' })
  start: Date;
  // TODO choose more optimal variant
  @Column({ type: 'timestamp' })
  end: Date;

  @Column({ enum: ['submitted', 'approved', 'denied'] })
  status: string;

  @Column({ type: 'text' })
  reason: string;

  @ManyToOne(() => UserEntity, (user) => user.vacations, {
    eager: true,
  })
  user: UserEntity;
}
