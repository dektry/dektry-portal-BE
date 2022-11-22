import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import { vacationStatuses, policyType } from '../utils/constants';

@Entity({ name: 'vacations' })
export class VacationsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: [policyType.vac, policyType.sick, policyType.leave] })
  policy: string;

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;

  @Column({ type: 'timestamptz' })
  create_at: Date;

  @Column({ type: 'timestamptz' })
  update_at: Date;

  @Column({
    enum: [
      vacationStatuses.submitted,
      vacationStatuses.approved,
      vacationStatuses.denied,
    ],
  })
  status: string;

  @Column({ type: 'text' })
  reason: string;

  @ManyToOne(() => UserEntity, (user) => user.vacations, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  user: UserEntity;
}
