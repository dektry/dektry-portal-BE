import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { AccessEntity } from './access.entity';

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

  @ManyToOne(() => AccessEntity, (access) => access.positionsGroups)
  access: AccessEntity[];
}
