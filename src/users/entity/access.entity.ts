import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { PositionGroupEntity } from './positionGroup.entity';

@Entity({ name: 'access' })
export class AccessEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  name: string;

  @OneToMany(() => PositionEntity, (position) => position.access, {
    cascade: true,
  })
  @JoinColumn()
  positions: PositionEntity[];
  // @ManyToMany(() => PositionEntity, (position) => position.access, {
  //   cascade: true,
  // })
  // @JoinColumn()
  // positions: PositionEntity[];

  @OneToMany(() => PositionGroupEntity, (group) => group.access, {
    cascade: true,
  })
  @JoinColumn()
  positionsGroups: PositionGroupEntity[];
}
