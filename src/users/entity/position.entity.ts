import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { PositionGroupEntity } from './positionGroup.entity';
@Entity({ name: 'positions' })
export class PositionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  duties: string;

  @Column()
  requirements: string;

  @Column()
  salaryMinLimit: number;

  @Column()
  salaryMaxLimit: number;

  @ManyToOne(
    () => PositionGroupEntity,
    (positionGroup) => positionGroup.positions,
  )
  group: PositionGroupEntity;
}
