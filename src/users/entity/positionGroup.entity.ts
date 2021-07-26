import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PositionEntity } from './position.entity';

@Entity({ name: 'positionGroup' })
export class PositionGroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => PositionEntity, (position) => position.group, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  positions: PositionEntity[];

  @Column({ length: 255 })
  color: string;
}
